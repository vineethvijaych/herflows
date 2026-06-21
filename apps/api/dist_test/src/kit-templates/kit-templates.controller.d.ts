import { KitTemplatesService } from './kit-templates.service';
export declare class KitTemplatesController {
    private kitTemplatesService;
    constructor(kitTemplatesService: KitTemplatesService);
    create(user: {
        id: string;
    }, data: {
        name: string;
        items: {
            productVariantId: string;
            quantity: number;
        }[];
    }): Promise<{
        items: {
            id: string;
            quantity: number;
            productVariantId: string;
            kitTemplateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    }>;
    update(user: {
        id: string;
    }, id: string, data: {
        name?: string;
        items?: {
            productVariantId: string;
            quantity: number;
        }[];
    }): Promise<{
        items: {
            id: string;
            quantity: number;
            productVariantId: string;
            kitTemplateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    }>;
    findAll(user: {
        id: string;
    }): Promise<({
        items: {
            id: string;
            quantity: number;
            productVariantId: string;
            kitTemplateId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    })[]>;
    setActive(user: {
        id: string;
    }, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        userId: string;
        isActiveSource: boolean;
    }>;
}
