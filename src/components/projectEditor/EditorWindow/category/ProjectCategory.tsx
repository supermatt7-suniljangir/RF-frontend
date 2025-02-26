import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { categories } from '@/lib/categories';
import { useProjectContext } from '@/contexts/ProjectContext';

const ProjectCategory: React.FC = () => {
    const { projectMetadata, updateProjectMetadata } = useProjectContext();
    const selectedCategory = projectMetadata.category || "";
    const handleCategorySelect = (category: string) => {
        if (selectedCategory === category) {
            updateProjectMetadata({ category: "" });
            return;
        }
        updateProjectMetadata({ category });
    };

    return (
        <Card className="shadow-none rounded-none border-none mt-2 p-4">
            <h2 className="font-semibold w-full">
                Categorize your project
            </h2>
            {!selectedCategory && <p className='text-sm text-red-600'>This field is requried</p>}
            <CardContent className='p-4'>
                <div className="gap-4 flex flex-wrap">
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-1 text-sm">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-muted focus:bg-red-600"
                                checked={selectedCategory === category}
                                onChange={() => handleCategorySelect(category)}
                            />
                            <span className="text-muted-foreground">{category}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProjectCategory;