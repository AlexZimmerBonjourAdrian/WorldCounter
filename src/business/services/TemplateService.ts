import { SocialTemplate } from '@/data/CounterData';

export class TemplateService {
  private static TEMPLATES: SocialTemplate[] = [
    { id: 'twitter', name: 'Twitter/X', platform: 'twitter', maxChars: 280 },
    { id: 'instagram', name: 'Instagram', platform: 'instagram', maxChars: 2200 },
    { id: 'linkedin', name: 'LinkedIn', platform: 'linkedin', maxChars: 3000 },
    { id: 'facebook', name: 'Facebook', platform: 'facebook', maxChars: 63206 },
    { id: 'custom', name: 'Personalizado', platform: 'custom', maxChars: 0 },
  ];

  static getTemplates(): SocialTemplate[] {
    return [...this.TEMPLATES];
  }

  static getTemplate(id: string): SocialTemplate | null {
    return this.TEMPLATES.find(t => t.id === id) || null;
  }

  static addCustomTemplate(template: SocialTemplate): void {
    // Opcional: guardar en localStorage para persistencia personalizada
    const customTemplates = this.getCustomTemplates();
    customTemplates.push(template);
    localStorage.setItem('worldcounter_custom_templates', JSON.stringify(customTemplates));
  }

  static getCustomTemplates(): SocialTemplate[] {
    try {
      const stored = localStorage.getItem('worldcounter_custom_templates');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getAllTemplates(): SocialTemplate[] {
    return [...this.TEMPLATES, ...this.getCustomTemplates()];
  }
}
