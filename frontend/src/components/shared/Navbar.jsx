import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, User2 } from 'lucide-react';

const Navbar = () => {
   
    const user = false; 

    return (
        <div className='bg-white border-b border-gray-100'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <h1 className='text-2xl font-bold'>
                        Next<span className='text-[#F83002]'>Hire</span>
                    </h1>
                </div>

                <div className='flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        <li className='cursor-pointer hover:text-[#F83002] transition-all'>Home</li>
                        <li className='cursor-pointer hover:text-[#F83002] transition-all'>Jobs</li>
                        <li className='cursor-pointer hover:text-[#F83002] transition-all'>Browse</li>
                    </ul>
                    
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Button variant="outline">Login</Button>
                                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>AS</AvatarFallback>
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className='flex gap-4 items-center mb-4'>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                            <AvatarFallback>AS</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className='font-medium'>Avnit Singh</h4>
                                            <p className='text-sm text-muted-foreground'>Software Developer</p>
                                        </div>
                                    </div>

                                    <hr className='my-2' />

                                    <div className='flex flex-col text-gray-600'>
                                        <div className='flex w-full items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 rounded-md transition-colors'>
                                            <User2 className='w-4 h-4' />
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                                            >
                                                View Profile
                                            </Button>
                                        </div>
                                        <div className='flex w-full items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 rounded-md transition-colors'>
                                            <LogOut className='w-4 h-4' />
                                            <Button
                                                variant="link"
                                                className="p-0 h-auto font-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;