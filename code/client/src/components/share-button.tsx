"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, LoaderIcon, Share2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import {
  createDocumentAccessSchema,
  createDocumentAccessValues,
} from "@/lib/zod";
import { useDocumentStore } from "@/store/document-store";
import { AccessRole } from "@prisma/client";

export default function ShareButton() {
  const document = useDocumentStore((state) => state.document);

  const documentId = document?.id || "";

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isInviting, setIsInviting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const form = useForm<createDocumentAccessValues>({
    resolver: zodResolver(createDocumentAccessSchema),
    defaultValues: {
      email: "",
      documentId,
    } as createDocumentAccessValues,
    mode: "onTouched",
  });

  async function onInvite(formData: createDocumentAccessValues) {
    try {
      setIsInviting(true);

      const response = await api("/api/document-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await response.json();

      await fetchSharedUsers(documentId);

      form.reset();

      toast.success(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsInviting(false);
    }
  }

  const sharedUsers = useDocumentStore((state) => state.sharedUsers);
  const fetchSharedUsers = useDocumentStore((state) => state.fetchSharedUsers);

  async function onChangeRole(email: string, role: AccessRole) {
    try {
      setIsUpdating(true);

      const response = await api("/api/document-access", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, documentId, role }),
      });

      const { message } = await response.json();

      await fetchSharedUsers(documentId);

      toast.success(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsUpdating(false);
    }
  }

  async function onRemove(email: string) {
    try {
      setIsDeleting(true);

      const response = await api("/api/document-access", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, documentId: document?.id }),
      });

      const { message } = await response.json();

      await fetchSharedUsers(documentId);

      toast.success(message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          setIsShareModalOpen(true);
        }}
      >
        <Share2 />
        <span>Share</span>
      </Button>

      <Dialog
        open={isShareModalOpen}
        onOpenChange={() => {
          setIsShareModalOpen(false);
          form.reset();
        }}
      >
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Manage Users</DialogTitle>
            <DialogDescription>
              Select which users can access this document
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onInvite)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Email address</FormLabel>
                    <FormControl>
                      <div className="flex space-x-4">
                        <Input
                          type="email"
                          placeholder="Email address"
                          className="text-sm"
                          {...field}
                          disabled={isInviting || isUpdating || isDeleting}
                        />
                        <Button
                          type="submit"
                          disabled={!form.formState.isValid || isInviting}
                        >
                          {isInviting ? (
                            <LoaderIcon className="animate-spin" />
                          ) : (
                            "Invite"
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          {sharedUsers.map(({ id, role, user }) => {
            return (
              <div key={id} className="flex items-center justify-between gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="flex items-center justify-center text-sm font-semibold w-8 h-8 border rounded-full"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {role === AccessRole.OWNER ? (
                    <Button variant="link" size="sm" disabled>
                      <span>Owner</span>
                    </Button>
                  ) : (
                    <>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={isInviting || isUpdating || isDeleting}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="border"
                          >
                            {role}
                            <ChevronsUpDown />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              if (role === AccessRole.VIEWER) return;
                              onChangeRole(user.email, AccessRole.VIEWER);
                            }}
                          >
                            can view
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              if (role === AccessRole.EDITOR) return;
                              onChangeRole(user.email, AccessRole.EDITOR);
                            }}
                          >
                            can edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-destructive"
                        onClick={() => {
                          onRemove(user.email);
                        }}
                        disabled={isInviting || isUpdating || isDeleting}
                      >
                        <span>Remove</span>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </DialogContent>
      </Dialog>
    </>
  );
}

// "use client";

// import { useState } from "react";
// import { ChevronsUpDown, Copy, Share2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";

// export default function ShareButton() {
//   const [email, setEmail] = useState<string>("");
//   const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
//   const [publicAccess, setPublicAccess] = useState<string>("disabled");

//   const [documentAccess, setDocumentAccess] = useState([
//     {
//       id: "1",
//       name: "User1",
//       email: "user1@email.com",
//       emailVerified: true,
//       color: "#C084FC",
//       accessType: "owner",
//       createdAt: "1",
//     },
//     {
//       id: "2",
//       name: "Alice",
//       email: "alice@email.com",
//       emailVerified: true,
//       color: "#F87171",
//       accessType: "can edit",
//       createdAt: "2",
//     },
//     {
//       id: "3",
//       name: "Bob",
//       email: "bob@email.com",
//       emailVerified: true,
//       color: "#FBBF24",
//       accessType: "can edit",
//       createdAt: "3",
//     },
//     {
//       id: "4",
//       name: "Charlie",
//       email: "charlie@email.com",
//       emailVerified: true,
//       color: "#34D399",
//       accessType: "can view",
//       createdAt: "4",
//     },
//   ]);

//   return (
//     <>
//       <Button
//         onClick={() => {
//           setIsShareModalOpen(true);
//         }}
//       >
//         <Share2 />
//         <span>Share</span>
//       </Button>

//       <Dialog
//         open={isShareModalOpen}
//         onOpenChange={() => {
//           setIsShareModalOpen(false);
//           setEmail("");
//         }}
//       >
//         <DialogContent
//           onOpenAutoFocus={(e) => e.preventDefault()}
//           onCloseAutoFocus={(e) => e.preventDefault()}
//         >
//           <DialogHeader>
//             <DialogTitle>Manage Users</DialogTitle>
//             <DialogDescription>
//               Select which users can access this document
//             </DialogDescription>
//           </DialogHeader>
//           <Label htmlFor="email">Email address</Label>
//           <div className="flex gap-4">
//             <Input
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email address"
//             />
//             <Button
//               onClick={() => {
//                 if (!email.trim()) return;

//                 const newUser = {
//                   id: Date.now().toString(),
//                   name: email.split("@")[0],
//                   email,
//                   emailVerified: false,
//                   color: "#A3A3A3",
//                   accessType: "can view",
//                   createdAt: new Date().toISOString(),
//                 };
//                 setDocumentAccess((prev) => [...prev, newUser]);
//                 setEmail("");
//               }}
//             >
//               Invite
//             </Button>
//           </div>

//           {documentAccess.map((user) => {
//             return (
//               <div
//                 key={user.id}
//                 className="flex items-center justify-between gap-2"
//               >
//                 <div className="flex items-center justify-between gap-2">
//                   <div
//                     className="flex items-center justify-center text-sm font-semibold w-8 h-8 border rounded-full"
//                     style={{ backgroundColor: user.color }}
//                   >
//                     {user.name.charAt(0).toUpperCase()}
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm font-medium">{user.name}</span>
//                     <span className="text-xs text-muted-foreground">
//                       {user.email}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex gap-4">
//                   {user.accessType === "owner" ? (
//                     <Button variant="link" size="sm" disabled>
//                       <span>Owner</span>
//                     </Button>
//                   ) : (
//                     <>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="secondary"
//                             size="sm"
//                             className="border"
//                           >
//                             {user.accessType}
//                             <ChevronsUpDown />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setDocumentAccess((prev) =>
//                                 prev.map((u) =>
//                                   u.id === user.id
//                                     ? { ...u, accessType: "can view" }
//                                     : u
//                                 )
//                               );
//                             }}
//                           >
//                             can view
//                           </DropdownMenuItem>
//                           <DropdownMenuItem
//                             onClick={() => {
//                               setDocumentAccess((prev) =>
//                                 prev.map((u) =>
//                                   u.id === user.id
//                                     ? { ...u, accessType: "can edit" }
//                                     : u
//                                 )
//                               );
//                             }}
//                           >
//                             can edit
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                       <Button
//                         variant="link"
//                         size="sm"
//                         className="text-destructive"
//                         onClick={() => {
//                           setDocumentAccess((prev) =>
//                             prev.filter((u) => u.id !== user.id)
//                           );
//                         }}
//                       >
//                         <span>Remove</span>
//                       </Button>
//                     </>
//                   )}
//                 </div>
//               </div>
//             );
//           })}

//           <DialogFooter className="flex items-center !justify-between border-t pt-4">
//             <span className="text-sm text-muted-foreground">
//               Enable anyone with the link to access
//             </span>
//             <div className="flex gap-4">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="secondary" size="sm" className="border">
//                     {publicAccess}
//                     <ChevronsUpDown />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent>
//                   <DropdownMenuItem onClick={() => setPublicAccess("disabled")}>
//                     disabled
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setPublicAccess("can view")}>
//                     can view
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => setPublicAccess("can edit")}>
//                     can edit
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//               <Button size="sm">
//                 <Copy />
//                 <span>Copy</span>
//               </Button>
//             </div>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
