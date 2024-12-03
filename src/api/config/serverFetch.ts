// // import ApiService from "@/api/wrapper/axios-wrapper";
// import { User } from "@/types/user";
// import axios from "axios";

// export const getProfile = async (authToken: string): Promise<User | null> => {
//   try {
//     // const apiService = ApiService.getInstance();
//     const response = await axios.get("http://localhost:5500/api/users/", {
//       headers: {
//         Cookie: `auth_token=${authToken}`, // Manually set the cookie
//       },
//       withCredentials: true, // Important: This enables sending cookies in cross-origin requests
//     });
//     if (response) {
//       return response.data; // Directly return the user object
//     } else {
//       console.warn("Unexpected empty response");
//       return null;
//     }
//   } catch (error) {
//     console.error(
//       "Profile fetch error:",
//       error instanceof Error ? error.message : error
//     );
//     return null;
//   }
// };



// where you need this data
// let user: User | null = null;

// try {
//   // Retrieve cookies synchronously
//   const cookieStore = await cookies();
//   const authToken = cookieStore.get("auth_token")?.value;
//   console.log(authToken);
//   // Fetch user profile if authToken exists
//   if(authToken)user = await getProfile();
//   console.log(user)
// } catch (error) {
//   console.error("Error fetching user profile and this is where the page.tsx is:", error);
// }