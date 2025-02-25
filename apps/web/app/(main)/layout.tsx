import React from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar/SideBar';


interface Props {
  children: React.ReactNode;
}

export default async function MainLayout(props: Props) {
    const session = await getServerSession();

    if (!session?.user) {
        redirect('/');
    }
    return <div className="flex min-h-screen w-full">
        <Sidebar/>
        <div className="wrapper w-full">{props.children}</div>
    </div>;
}