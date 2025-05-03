import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HiPlus, HiSearch } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Funnel, ChevronDown } from "lucide-react";
import { AddEventDialog } from "@/components/organisms/addEventDialog";

function EventsScreen() {

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="mt-4 text-gray-600">
            Manage and track your events here.
          </p>
        </div>

        <div>
         <AddEventDialog />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="relative w-2/3 flex justify-start">
          <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search events..." className="pl-10 w-full" />
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                <Funnel className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" className="bg-transparent">
                Newest
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-4 bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-gray-500 text-lg">No events found.</p>
        </div>
      </div>
    </div>
  );
}

export default EventsScreen;
