import React from "react";

const RoomList = () => {
    return (
        <>
            <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
                <div className="bg-gray-700 rounded-xl w-1/2 min-w-80 h-5/6 p-10 shadow-floating">
                    <div className="flex justify-center">
                        <span className="text-2xl">📚 방 목록</span>
                    </div>
                    <div className="flex justify-center w-full h-56 p-5">
                        <div className="bg-orange-500 rounded-xl w-1/2 p-10 shadow-floating hover:shadow-floating hover:transition-all"></div>
                        <div className="m-3"></div>
                        <div className="bg-orange-500 rounded-xl w-1/2 p-10 shadow-floating hover:shadow-floating hover:transition-all"></div>
                        <div className="m-3"></div>
                        <div className="bg-orange-500 rounded-xl w-1/2 p-10 shadow-floating hover:shadow-floating hover:transition-all"></div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default RoomList;