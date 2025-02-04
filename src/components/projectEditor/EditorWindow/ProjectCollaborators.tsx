import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Delete } from 'lucide-react'
import MiniUserInfo from '@/components/common/MiniUserInfo'
import { useEditor } from '@/contexts/ProjectEditorContext'
import { fetchUsers } from '@/services/search/search'
import { MiniUser } from '@/types/user'

const ProjectCollaborators: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const { collaborators, updateCollaborators } = useEditor()
    const [userSearchResults, setUserSearchResults] = useState<MiniUser[]>([])
    const searchTimeoutRef = useRef<NodeJS.Timeout>()

    const updateCollaborator = (collaboratorId: string) => {
        const newCollaborators = collaborators.filter(collaborator => collaborator._id !== collaboratorId)
        updateCollaborators(newCollaborators)
    }

    useEffect(() => {
        // Cleanup function to abort any pending requests when component unmounts
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)

        // Clear previous timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        // Clear results if query is empty
        if (!query.trim()) {
            setUserSearchResults([])
            setIsLoading(false)
            return
        }

        // Abort any previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        setIsLoading(true)

        // Create a new AbortController for this request
        const controller = new AbortController()
        abortControllerRef.current = controller

        // Debounce the search
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const users = await fetchUsers(
                    { query, limit: 20, page: 1 },
                    "no-store",
                    controller.signal
                )

                // Only update if the request wasn't aborted
                if (!controller.signal.aborted) {
                    setUserSearchResults(users.data || [])
                }
            } catch (error) {
                // Ignore abort errors
                if (error.name !== 'AbortError') {
                    console.error('Search error:', error)
                    setUserSearchResults([])
                }
            } finally {
                setIsLoading(false)
            }
        }, 300)
    }

    const handleAddCollaborator = (user: MiniUser) => {
        // Check if user is already a collaborator
        if (!collaborators.some(collab => collab._id === user._id)) {
            updateCollaborators([...collaborators, user])
        }
        setSearchQuery('')
        setUserSearchResults([])
    }

    return (
        <Card className="shadow-none rounded-none border-none p-4">
            <h2 className="font-semibold w-full">Collaborators</h2>
            <CardContent className="mt-2 p-0">
                <div>
                    {collaborators.length > 0 && (
                        <>
                            <p className="text-sm">Selected Collaborators:</p>
                            <div className="flex flex-wrap py-2 items-center w-fit gap-2">
                                {collaborators.map((collaborator, index) => (
                                    <div key={collaborator._id} className="flex items-center gap-2 px-4 py-2 bg-muted h-fit">
                                        <MiniUserInfo
                                            avatar={collaborator.avatar}
                                            fullName={collaborator.fullName}
                                            id={collaborator._id}
                                            styles="pointer-events-none"
                                        />
                                        <Button
                                            variant="ghost"
                                            className="h-fit p-0"
                                            onClick={() => updateCollaborator(collaborator._id)}
                                        >
                                            <Delete className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <Button variant="link" className="pl-0" onClick={() => setIsOpen(open => !open)}>
                    Add a Collaborator
                </Button>

                <Card className="p-4 rounded-none border-none shadow-none" style={{ display: isOpen ? 'block' : 'none' }}>
                    <input
                        type="text"
                        placeholder="Search for a collaborator"
                        className="w-full p-2 border rounded-none"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <CardContent className="p-4 shadow-sm border h-48 overflow-scroll">
                        {isLoading ? (
                            <div className="text-sm text-muted-foreground">Loading...</div>
                        ) : userSearchResults.length > 0 ? (
                            userSearchResults.map((user, index) => {
                                const added = collaborators.some(collab => collab._id === user._id)
                                return <div key={user._id} className="flex items-center justify-between gap-2 px-4 py-2 bg-muted h-fit mb-2">
                                    <MiniUserInfo
                                        avatar={user.avatar}
                                        fullName={user.fullName}
                                        id={user._id}
                                        styles="pointer-events-none"
                                    />
                                    <Button
                                        disabled={added}
                                        variant="ghost"
                                        className="h-fit px-2"
                                        onClick={() => handleAddCollaborator(user)}
                                    >
                                        {added ? 'Added' : 'Add'}
                                    </Button>
                                </div>
                            })
                        ) :
                            <div className="text-sm text-muted-foreground w-full h-full text-center mt-10">{searchQuery ? "No Results Found" : "Search for a user"}</div>
                        }
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    )
}

export default ProjectCollaborators