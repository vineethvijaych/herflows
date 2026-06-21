export declare class EducationService {
    private articles;
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
