import { User, UserRole, UserStatus } from "@/types/user.types";

export const INITIAL_USERS: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@coffeeshop.com",
    phone: "+1 (555) 123-4567",
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.j@coffeeshop.com",
    phone: "+1 (555) 234-5678",
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.d@coffeeshop.com",
    phone: "+1 (555) 345-6789",
    role: UserRole.STAFF,
    status: UserStatus.ACTIVE,
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Chen",
    email: "emily.chen@coffeeshop.com",
    phone: "+1 (555) 456-7890",
    role: UserRole.STAFF,
    status: UserStatus.INACTIVE,
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "d.wilson@coffeeshop.com",
    phone: "+1 (555) 567-8901",
    role: UserRole.MANAGER,
    status: UserStatus.ACTIVE,
  },
];
