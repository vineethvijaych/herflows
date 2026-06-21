import { EducationService } from './education.service';
export declare class EducationController {
    private educationService;
    constructor(educationService: EducationService);
    findAll(): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        category: string;
        publishedAt: Date;
    }[]>;
    findBySlug(slug: string): Promise<{
        id: string;
        slug: string;
        title: string;
        excerpt: string;
        content: string;
        category: string;
        publishedAt: Date;
    }>;
}
