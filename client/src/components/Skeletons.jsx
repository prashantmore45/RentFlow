export const RoomCardSkeleton = () => (
    <div className="min-w-[85vw] md:min-w-[350px] lg:min-w-[400px] snap-center bg-gray-800 rounded-3xl overflow-hidden border border-gray-700 animate-pulse">
        <div className="h-56 bg-gray-700"></div>
        <div className="p-5">
            <div className="h-6 bg-gray-700 rounded-full w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded-full w-1/2 mb-6"></div>
            <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                <div className="h-6 bg-gray-700 rounded-md w-1/3"></div>
                <div className="h-4 bg-gray-700 rounded-full w-1/5"></div>
            </div>
        </div>
    </div>
);

export const RoomDetailsSkeleton = () => (
    <div className="min-h-screen bg-gray-900 animate-pulse pb-20">
        <div className="h-[50vh] w-full bg-gray-800"></div>
        
        <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
                    <div className="h-6 bg-gray-700 w-1/4 rounded-full mb-4"></div>
                    <div className="h-10 bg-gray-700 w-3/4 rounded-lg mb-4"></div>
                    <div className="h-5 bg-gray-700 w-1/2 rounded-full mb-8"></div>
                    
                    <div className="border-t border-gray-700 my-6 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-700 rounded-xl"></div>)}
                    </div>
                    
                    <div className="h-8 bg-gray-700 w-1/3 rounded-lg mb-4 mt-8"></div>
                    <div className="h-24 bg-gray-700 w-full rounded-xl"></div>
                </div>
            </div>
            
            <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-2xl">
                    <div className="h-16 bg-gray-700 w-full rounded-xl mb-6"></div>
                    <div className="h-14 bg-gray-700 w-full rounded-xl mb-3"></div>
                    <div className="h-14 bg-gray-700 w-full rounded-xl"></div>
                </div>
            </div>
        </div>
    </div>
);
