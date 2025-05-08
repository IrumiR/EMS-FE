import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CardContent } from "../ui/card";
import { useGetUserById } from "@/api/authApi";
import { format } from "date-fns"; 
import { Badge } from "../ui/badge"; 

export function ViewUserDialog({ userId, trigger }: { userId: string; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(open ? userId : null);
  
  const userDetails = userData?.user || {};

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "PPP"); 
    } catch (error) {
      return "Invalid Date";
    }
  };


  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "manager":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "team-member":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "client":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">User Details</DialogTitle>
          <DialogDescription className="text-center">
            View complete information about this user
          </DialogDescription>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="flex justify-center py-8">Loading user data...</div>
        ) : (
          <>
            {userDetails._id ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                    {userDetails.profileImage ? (
                      <img 
                        src={userDetails.profileImage} 
                        alt={userDetails.userName} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-bold text-gray-500">
                        {userDetails.userName?.charAt(0).toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold">{userDetails.userName}</h3>
                  <Badge className={`mt-2 ${getRoleBadgeColor(userDetails.role)}`}>
                    {typeof userDetails.role === 'string' 
                      ? userDetails.role.charAt(0).toUpperCase() + userDetails.role.slice(1) 
                      : Array.isArray(userDetails.role) 
                        ? userDetails.role.join(", ") 
                        : "No Role"}
                  </Badge>
                  <span className={`mt-2 text-sm px-2 py-1 rounded-full ${userDetails.isActive 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"}`}>
                    {userDetails.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  {[
                    { label: "Email", value: userDetails.email || "N/A" },
                    { label: "Phone", value: userDetails.contactNumber || "N/A" },
                    { label: "Address", value: userDetails.address || "N/A" },
                    { label: "Created", value: formatDate(userDetails.createdAt) },
                    { label: "Last Updated", value: formatDate(userDetails.updatedAt) },
                    { label: "User ID", value: userDetails._id }
                  ].map((item, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="text-sm text-gray-500">{item.label}</Label>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  ))}
                </CardContent>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">User information not available</p>
              </div>
            )}
          </>
        )}
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}