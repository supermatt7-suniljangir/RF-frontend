// CollaboratorList.tsx
import React, { memo } from 'react'
import { MiniUser } from '@/types/user'
import CollaboratorItem from './CollaboratorItem'

interface CollaboratorListProps {
    collaborators: MiniUser[]
    onRemove: (id: string) => void
}

const CollaboratorsList: React.FC<CollaboratorListProps> = ({ collaborators, onRemove }) => {
    return (
        <div>
            <p className="text-sm">Selected Collaborators:</p>
            <div className="flex flex-wrap py-2 items-center w-fit gap-2">
                {collaborators.map((collaborator) => (
                    <CollaboratorItem
                        key={collaborator._id}
                        collaborator={collaborator}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    )
}

export default memo(CollaboratorsList)