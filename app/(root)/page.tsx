import React from "react";

export default async function Home() {
    // todo redirect to login page if not logged in

  return (
    <div className="flex-center h-screen">
      <h1 className="text-4xl text-brand">
        Hello
      </h1>
      <h1 className="text-4xl text-brand-100">
        Hello there
      </h1>
    </div>
    
  );
}
