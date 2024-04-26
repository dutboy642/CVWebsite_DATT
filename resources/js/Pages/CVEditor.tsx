import { useState } from "react";
import 'react-quill/dist/quill.bubble.css';
import { ComponentInstance } from '@/types';
import FrameComponent from '@/Components/FrameComponent';
import { position } from '@/types';
import TextComponent from '@/Components/TextComponent';
import { TextComponentInstance } from '@/types';

export default function CVEditor() {
    const [instances, setInstances] = useState<ComponentInstance[]>([]);// framecomponent
    const [textInstances, setTextInstances] = useState<TextComponentInstance[]>([]);// textcomponent
    const [nextId, setNextId] = useState(1); //framecomponent
    const [nextTextId, setNextTextId] = useState(1); //textcomponent
    // State để lưu trữ kích thước và vị trí của component
    const frameComponentPosition = { x: 10, y: 10 };
    const frameComponentSize = { width: 100, height: 50 };
    const textComponentPosition = { x: 10, y: 210 };
    const textComponentSize = { width: 150, height: 40 };
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [currentClassesComponent, setCurrentClassesComponent] = useState("");

    const setCurrentClassesComponentFunction = (x: string) => {
        setCurrentClassesComponent(x);
    }
    const setDragStartFunction = (x: position) => {
        setDragStart(x);
    }

    const updateInstance = (idToUpdate: string, updatedInstance: ComponentInstance) => {
        // Sao chép mảng state hiện tại
        const updatedInstances = [...instances];
        // Tìm phần tử cần sửa đổi trong mảng sao chép
        const indexToUpdate = updatedInstances.findIndex(instance => instance.id === idToUpdate);

        // Kiểm tra xem phần tử cần sửa có tồn tại trong mảng không
        if (indexToUpdate !== -1) {
            // Thực hiện sửa đổi trên phần tử mong muốn
            updatedInstances[indexToUpdate] = updatedInstance;
            // Cập nhật state với mảng mới đã sửa đổi
            setInstances(updatedInstances);
        } else {
            console.log('Không tìm thấy phần tử cần sửa đổi.');
        }
    };
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {

        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        setCurrentClassesComponent((event.target as HTMLDivElement).getAttribute("class") || "");
        setDragStart({ x: event.clientX, y: event.clientY });
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        console.log(currentClassesComponent.includes('mainComponent'))
        event.preventDefault();
        if (currentClassesComponent.includes('mainComponent')) {
            if (currentClassesComponent.includes('textComponent')) {
                const newInstance: TextComponentInstance = {
                    id: 'Text' + nextTextId.toString(),
                    position: { x: textComponentPosition.x + event.clientX - dragStart.x, y: textComponentPosition.y - 56 + event.clientY - dragStart.y },
                    size: { width: textComponentSize.width, height: textComponentSize.height },
                    text: '',
                    isFocus: false,
                };
                setTextInstances([...textInstances, newInstance]);
                setNextTextId(nextTextId + 1);
                setCurrentClassesComponent("")
            }
            else {
                const newInstance: ComponentInstance = {
                    id: nextId.toString(),
                    position: { x: frameComponentPosition.x + event.clientX - dragStart.x, y: frameComponentPosition.y + 48 + event.clientY - dragStart.y },
                    size: { width: frameComponentSize.width, height: frameComponentSize.height },
                    isFocus: false,
                };
                setInstances([...instances, newInstance]);
                setNextId(nextId + 1);
                setCurrentClassesComponent("")
            }
        }
        else {
            if (currentClassesComponent.includes("textComponent")) {
                let id = event.dataTransfer.getData("Id");
                const newInstance = textInstances.find((instance) => instance.id === id);
                if (!newInstance) return;
                const newX = newInstance.position.x + event.clientX - dragStart.x;
                const newY = newInstance.position.y + event.clientY - dragStart.y;
                newInstance.position = { x: newX, y: newY };
                newInstance.isFocus = true;
                updateTextInstance(id, newInstance)
            }
            else {
                let id = event.dataTransfer.getData("Id");
                const newInstance = instances.find((instance) => instance.id === id);
                if (!newInstance) return;
                const newX = newInstance.position.x + event.clientX - dragStart.x;
                const newY = newInstance.position.y + event.clientY - dragStart.y;
                newInstance.isFocus = true;
                newInstance.position = { x: newX, y: newY };
                updateInstance(id, newInstance)
            }
        }
    };

    const updateTextInstance = (idToUpdate: string, updatedInstance: TextComponentInstance) => {
        // Sao chép mảng state hiện tại
        const updatedInstances = [...textInstances];

        // Tìm phần tử cần sửa đổi trong mảng sao chép
        const indexToUpdate = updatedInstances.findIndex(instance => instance.id === idToUpdate);
        // Kiểm tra xem phần tử cần sửa có tồn tại trong mảng không
        if (indexToUpdate !== -1) {
            // Thực hiện sửa đổi trên phần tử mong muốn
            updatedInstances[indexToUpdate] = updatedInstance;
            setTextInstances(updatedInstances);
        } else {
            console.log('Không tìm thấy phần tử cần sửa đổi.');
        }
    };

    return (
        <div className="grid grid-cols-4 h-screen">

            <div className="bg-gray-300 h-full">1
                <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>
                <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                        <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">E-commerce</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                    <li>
                                        {/* <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Products</a>
                                         */}
                                        <div
                                            className=" bg-gray-300 border border-gray-500 cursor-move mainComponent frameComponent"
                                            style={{ width: frameComponentSize.width, height: frameComponentSize.height, left: frameComponentPosition.x, top: frameComponentPosition.y }}
                                            draggable="true"
                                            onDragStart={handleDragStart}
                                            onDragOver={(event) => event.preventDefault()}
                                        >
                                        </div>
                                    </li>
                                    <li>
                                        {/* <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Billing</a> */}
                                        <div
                                            draggable="true"
                                            className='w-8 h-8 border border-gray-500 cursor-move mainComponent textComponent'
                                            style={{ width: textComponentSize.width, height: textComponentSize.height, left: textComponentPosition.x, top: textComponentPosition.y }}

                                            onDragStart={handleDragStart}
                                            onDrop={handleDrop}
                                            onDragOver={(event) => event.preventDefault()}
                                        >
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
            <div className="h-full col-span-3 bg-black"
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}>2
                {instances.map((instance) => (
                    <FrameComponent setCurrentClassesComponentFunction={setCurrentClassesComponentFunction} dragStart={dragStart} setDragStart={setDragStartFunction} instance={instance} updateInstance={updateInstance} />
                ))}
                {textInstances.map((instance) => (
                    <TextComponent setCurrentClassesComponentFunction={setCurrentClassesComponentFunction} setDragStart={setDragStartFunction} dragStart={dragStart} instance={instance} updateInstance={updateTextInstance} />
                ))}</div>
        </div >

    );
}
