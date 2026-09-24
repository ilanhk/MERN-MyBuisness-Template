import { Injectable, NotFoundException } from '@nestjs/common';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { RedisService } from '../infrastructure/redis.service';
import { WebsiteStylesDocument, WebsiteStylesModel } from './website-styles.schema';

const CACHE_TTL_SECONDS = 86400;

@Injectable()
export class WebsiteStylesService {
  constructor(private readonly redis: RedisService) {}

  async findAll() {
    const client = this.redis.getClient();
    const cached = await client?.get('websiteStyless');
    if (cached) return JSON.parse(cached);
    const styles = await WebsiteStylesModel.find().lean().exec();
    await client?.set('websiteStyless', JSON.stringify(styles), { EX: CACHE_TTL_SECONDS });
    return styles;
  }

  async findById(id: string) {
    const client = this.redis.getClient();
    const cacheKey = `websiteStyles:${id}`;
    const cached = await client?.get(cacheKey);
    if (cached) return JSON.parse(cached);
    const styles = await WebsiteStylesModel.findById(id).lean().exec();
    if (!styles) throw new NotFoundException({ message: 'websiteStyles not found' });
    await client?.set(cacheKey, JSON.stringify(styles), { EX: CACHE_TTL_SECONDS });
    return styles;
  }

  async create() {
    const styles = await WebsiteStylesModel.create({
      general: { backgroundColor: '#ffffff', font: "'Serif', sans-serif", wordColor: '#0f0f75', wordSize: '16px', titleSize: '48px' },
      headerAndFooter: { backgroundColor: '#d4d1d1', fontSize: '16px', wordColor: '#000000', dropdown: { backgroundColor: '#dddcdc', wordColor: '#000000', hoverColor: '#aaa7a7' } },
      admin: { backgroundColor: '#ffffff', wordColor: '#0f0f75', sideBar: { backgroundColor: '#0AB7DA', wordColor: '#000000' } },
      saves: { colors: ['#ffffff', '#0f0f75', '#d4d1d1', '#000000'], fonts: ["'Serif', sans-serif"] },
    });
    this.writeCss(styles);
    return styles;
  }

  async update(id: string, patch: Record<string, unknown>) {
    const styles = await WebsiteStylesModel.findById(id).exec();
    if (!styles) throw new NotFoundException({ message: 'websiteStyles not found' });
    this.mergeNested(styles, patch);
    const updated = await styles.save();
    await this.redis.getClient()?.del([`websiteStyles:${id}`, 'websiteStyless']);
    this.writeCss(updated);
    return updated;
  }

  async delete(id: string) {
    const styles = await WebsiteStylesModel.findById(id).exec();
    if (!styles) throw new NotFoundException({ message: 'websiteStyles not found' });
    await WebsiteStylesModel.deleteOne({ _id: id }).exec();
    await this.redis.getClient()?.del([`websiteStyles:${id}`, 'websiteStyless']);
    return { message: 'websiteStyles deleted successfuly' };
  }

  private writeCss(styles: WebsiteStylesDocument): void {
    const general = styles.general as Record<string, any>;
    const header = styles.headerAndFooter as Record<string, any>;
    const admin = styles.admin as Record<string, any>;
    const css = `:root {\n  --general-background-color: ${general.backgroundColor};\n  --general-font: ${general.font};\n  --general-word-color: ${general.wordColor};\n  --general-font-size: ${general.wordSize};\n  --general-title-font-size: ${general.titleSize};\n  --header-footer-background-color: ${header.backgroundColor};\n  --header-footer-font-size: ${header.fontSize};\n  --header-footer-word-color: ${header.wordColor};\n  --header-footer-dropdown-background-color: ${header.dropdown?.backgroundColor};\n  --header-footer-dropdown-word-color: ${header.dropdown?.wordColor};\n  --header-footer-dropdown-hover-color: ${header.dropdown?.hoverColor};\n  --admin-background-color: ${admin.backgroundColor};\n  --admin-word-color: ${admin.wordColor};\n  --admin-sidebar-background-color: ${admin.sideBar?.backgroundColor};\n  --admin-sidebar-word-color: ${admin.sideBar?.wordColor};\n}`;
    writeFileSync(join(__dirname, '../../../frontend/src/general/css/globalVariables.css'), css, 'utf8');
  }

  private mergeNested(target: WebsiteStylesDocument, patch: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(patch)) {
      if (this.isObject(value) && this.isObject(target.get(key))) target.set(key, this.mergeObjects(target.get(key) as Record<string, unknown>, value));
      else if (value !== undefined) target.set(key, value);
    }
  }

  private mergeObjects(target: Record<string, unknown>, patch: Record<string, unknown>) {
    const merged = { ...target };
    for (const [key, value] of Object.entries(patch)) {
      if (this.isObject(value) && this.isObject(merged[key])) merged[key] = this.mergeObjects(merged[key] as Record<string, unknown>, value);
      else if (value !== undefined) merged[key] = value;
    }
    return merged;
  }

  private isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
