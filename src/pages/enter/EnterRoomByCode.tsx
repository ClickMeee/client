import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CheckExistsRoomByRoomId } from '../../api/CheckExistsRoomByRoomId';
import useMessages from '../../hooks/useMessage.ts';
import Modal from "../../components/modal/Modal.tsx";

const EnterRoomByCode = () => {

    const navigate = useNavigate();
    const [roomCodeInput, setRoomCodeInput] = useState<string>(''); // 닉네임 입력 상태

    const { messages, showMessage } = useMessages();

    const handleNavigatePage = (path: string) => {
        navigate(path);
    }

    const ifRoomExistsNavigateRoom = async (code: string) => {
        if(await CheckExistsRoomByRoomId(code)){
            handleNavigatePage(`/game-ready/${code}`)
            return;
        }
        showMessage("존재하지 않는 방입니다. 코드를 확인해주세요")
    }

    return (
        <>
            <Modal messages={messages} />
            <div className="flex z-10 flex-col justify-center items-center mt-10 md-10 bg-slate-50 bg-opacity-0 text-white p-6">
                <div className="bg-gray-700 rounded-xl max-w-100 w-1.5/5 min-w-80 h-5/6 p-10 shadow-floating">
                    <div className="text-center text-2xl mb-10">🐹 코드를 아래 입력해주세요 🐭</div>
                    <input
                        type="text"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value)}
                        className="w-full p-3 text-xl text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        onClick={() => ifRoomExistsNavigateRoom(roomCodeInput)}
                        className="m-0 mt-6 basic-button text-xl text-center mb-5">🚪 방 입장</button>
                </div>
            </div>
        </>
    );
};

export default EnterRoomByCode;
