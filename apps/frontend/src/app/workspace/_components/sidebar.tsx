import { PlusCircle, FolderPlus, Search } from 'lucide-react'
import RequestList from '@/app/workspace/_components/request-list'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

type Props = {}

export const Sidebar = (props: Props) => {
  const [activeRequest, setActiveRequest] = useState('req1')
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false)
  const [newRequestName, setNewRequestName] = useState('')
  const [newRequestMethod, setNewRequestMethod] = useState('GET')
  const { showToast } = useToast()

  const handleCreateRequest = () => {
    if (!newRequestName.trim()) {
      showToast({
        message: "Error! Please enter a request name",
        type: "error",
      })
      return
    }

    showToast({
      message: 'Request created',
      description: `Created new ${newRequestMethod} request: ${newRequestName}`,
      type: "success",
    })

    setShowNewRequestDialog(false)
    setNewRequestName('')
  }

  return (
    <div className="w-72 border-r border-zinc-200 flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-medium text-zinc-800">Requests</h2>
        <Dialog
          open={showNewRequestDialog}
          onOpenChange={setShowNewRequestDialog}
        >
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <PlusCircle size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Request</DialogTitle>
              <DialogDescription>
                Add a new API request to your collection.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Request Name</Label>
                <Input
                  id="name"
                  placeholder="My API Request"
                  value={newRequestName}
                  onChange={(e) => setNewRequestName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="method">HTTP Method</Label>
                <Select
                  value={newRequestMethod}
                  onValueChange={setNewRequestMethod}
                >
                  <SelectTrigger id="method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewRequestDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateRequest}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="p-3 px-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-zinc-800 size-4" />{' '}
          <Input
            className="pl-8 bg-zinc-50 border-zinc-200 w-full text-sm placeholder:text-sm"
            placeholder="Search requests..."
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <RequestList
          activeRequest={activeRequest}
          setActiveRequest={setActiveRequest}
        />
      </ScrollArea>

      <div className="p-3 border-t border-zinc-200">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-zinc-700"
        >
          <FolderPlus size={16} />
          <span>New Collection</span>
        </Button>
      </div>
    </div>
  )
}
