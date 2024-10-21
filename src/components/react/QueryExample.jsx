import { useQuery, useMutation } from "@tanstack/react-query";

import { useState } from "react";

import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

export function QueryExample() {
  const { toast } = useToast();
  const [isQueryEnabled, setIsQueryEnabled] = useState(false);

  const getPosts = async () =>
    await fetch("http://localhost:5000/api/posts").then((res) => res.json());

  // const queryClient = new QueryClient();
  const { isLoading, isPending, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    enabled: isQueryEnabled, // Query will only run when this is true
  });

  const handleClick = () => {
    setIsQueryEnabled(true); // Enable the query when the button is clicked
  };

  const postPost = async (newPost) => {
    const response = await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Assuming the server sends a JSON error response
      throw new Error(errorData.msg || "Network response was not ok");
      // throw errorData; // a way to throw the whole object, then handle after
    }

    return response.json();
  };

  const { mutateAsync: postMutation } = useMutation({
    mutationFn: postPost,
    onSuccess: async (data) => {
      const response = JSON.stringify(data);
      toast({
        className: "bg-green-500",
        // variant: "default",
        title: "Your changes have been saved!:)",
        description: `${JSON.stringify(data[0])}`,
      });
    },
    onError: async (error) => {
      toast({
        variant: "destructive",
        title: "There was an error saving your changes",
        description: `${error.msg || error}`,
      });
    },
    onSettled: async () => {
      console.log("mutation onSettled fired");
    },
  });

  const postClick = () => {
    const newPost = {
      // id: posts.length + 1,
      id: 10,
      title: "My new Post Title",
      comment: 20,
      email: "MyEmail@emailcom", // intentional error
      date: "10/202024", // intentional error
    };

    postMutation(newPost);
  };

  // loading states
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="container mx-auto py-10">
      <div className="bg-slate-900">
        <code className=" text-gray-300">{JSON.stringify(data)}</code>
      </div>
      <Button variant={"outline"} onClick={handleClick}>
        Fetch Posts
      </Button>
      <Button variant={"default"} onClick={postClick}>
        Post New Post
      </Button>
    </div>
  );
}
