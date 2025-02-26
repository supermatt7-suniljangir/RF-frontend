// ProjectCollaborators.tsx
import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useEditor } from '@/contexts/ProjectEditorContext'
import { MiniUser } from '@/types/user'
import CollaboratorSearch from './CollaboratorsSearch'
import CollaboratorsList from './CollaboratorsList'


const ProjectCollaborators: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { collaborators, updateCollaborators } = useEditor()

    const handleAddCollaborator = useCallback((user: MiniUser) => {
        // Check if user is already a collaborator
        if (!collaborators.some(collab => collab._id === user._id)) {
            updateCollaborators([...collaborators, user])
        }
    }, [collaborators, updateCollaborators])

    const handleRemoveCollaborator = useCallback((collaboratorId: string) => {
        const newCollaborators = collaborators.filter(collaborator => collaborator._id !== collaboratorId)
        updateCollaborators(newCollaborators)
    }, [collaborators, updateCollaborators])


    return (
        <Card className="shadow-none rounded-none border-none p-4">
            <h2 className="font-semibold w-full">Collaborators</h2>
            <CardContent className="mt-2 p-0">
                {collaborators.length > 0 && (
                    <CollaboratorsList
                        collaborators={collaborators}
                        onRemove={handleRemoveCollaborator}
                    />
                )}

                <Button variant="link" className="pl-0" onClick={() => setIsOpen(open => !open)}>
                    Add a Collaborator
                </Button>

                {isOpen && (
                    <CollaboratorSearch
                        collaborators={collaborators}
                        onAddCollaborator={handleAddCollaborator}
                    />
                )}
            </CardContent>
        </Card>
    )
}

export default ProjectCollaborators