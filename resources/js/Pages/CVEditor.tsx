import { useState } from "react";
import 'react-quill/dist/quill.bubble.css';
import { ComponentInstance } from '@/types';
import FrameComponent from '@/Components/FrameComponent';
import { position } from '@/types';
import TextComponent from '@/Components/TextComponent';
import { TextComponentInstance } from '@/types';
import { Page } from "@/types";
import { MouseEvent } from 'react';


export default function CVEditor() {
    // const [instances, setInstances] = useState<ComponentInstance[]>([]);// framecomponent
    // const [textInstances, setTextInstances] = useState<TextComponentInstance[]>([]);// textcomponent
    const [pages, setPages] = useState<Page[]>([{ id: 'Page0', frameInstanceList: [], textInstanceList: [] }]);// textcomponent
    const [numberOfPages, setNumberOfPages] = useState(pages.length);// textcomponent
    const [nextId, setNextId] = useState(1); //framecomponent
    const [nextTextId, setNextTextId] = useState(1); //textcomponent
    const [nextPageId, setNextPageId] = useState(1); //textcomponent
    const [displayMenu, setDisplaymenu] = useState(1);

    const [scaleValue, setscaleValue] = useState(100); //textcomponent
    const [calcScaleValue, setCalcScaleValue] = useState("scale(1,1)"); //textcomponent
    // State để lưu trữ kích thước và vị trí của component
    // const frameComponentPosition = { x: 10, y: 10 };
    const frameComponentSize = { width: 100, height: 50 };
    // const textComponentPosition = { x: 10, y: 210 };
    const textComponentSize = { width: 150, height: 40 };
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [currentClassesComponent, setCurrentClassesComponent] = useState("");

    const setCurrentClassesComponentFunction = (x: string) => {
        setCurrentClassesComponent(x);
    }
    const setDisplayMenuFunction = (x: number) => {
        setDisplaymenu(x);
    }
    const setDragStartFunction = (x: position) => {
        setDragStart(x);
    }
    const findPage = (id: string) => {
        const allPages = [...pages];
        const page = allPages.find(page => page.id === id);
        return page;
    }

    const updatePage = (id: string, page: Page) => {
        const allPages = [...pages];
        const indexToUpdate = allPages.findIndex(item => item.id === id);

        // Kiểm tra xem phần tử cần sửa có tồn tại trong mảng không
        if (indexToUpdate !== -1) {
            // Thực hiện sửa đổi trên phần tử mong muốn
            allPages[indexToUpdate] = page;
            // Cập nhật state với mảng mới đã sửa đổi
            setPages(allPages);
        } else {
            console.log('Không tìm thấy phần tử cần sửa đổi.');
        }

    }
    const cloneInstance = (pageId: string, id: string) => {
        let page = findPage(pageId);
        if (page) {
            const newInstances = page.frameInstanceList;
            const indexToUpdate = newInstances.findIndex(instance => instance.id === id);

            const newInstance: ComponentInstance = {
                id: nextId.toString(),
                position: { x: page.frameInstanceList[indexToUpdate].position.x, y: page.frameInstanceList[indexToUpdate].position.y },
                size: { width: page.frameInstanceList[indexToUpdate].size.width, height: page.frameInstanceList[indexToUpdate].size.height },
                isFocus: false,
                pageId: pageId,
                backgroundColor: page.frameInstanceList[indexToUpdate].backgroundColor
            };
            page.frameInstanceList.push(newInstance)
            updatePage(pageId, page)
            // setInstances([...instances, newInstance]);
            setNextId(nextId + 1);
        }
        else {
            console.log('Khong tim thay trang')
        }
    };

    const deteleInstance = (pageId: string, id: string) => {
        let page = findPage(pageId);
        if (page) {
            // Sao chép mảng state hiện tại
            const newInstances = page.frameInstanceList;
            // Tìm phần tử cần sửa đổi trong mảng sao chép
            page.frameInstanceList = newInstances.filter(instance => instance.id !== id);
            updatePage(pageId, page);
        }
        else {
            console.log('Khong tim thay trang');
        };
    }

    const updateInstance = (pageId: string, idToUpdate: string, updatedInstance: ComponentInstance) => {
        let page = findPage(pageId);
        if (page) {
            const updatedInstances = page.frameInstanceList;
            // Tìm phần tử cần sửa đổi trong mảng sao chép
            const indexToUpdate = updatedInstances.findIndex(instance => instance.id === idToUpdate);

            // Kiểm tra xem phần tử cần sửa có tồn tại trong mảng không
            if (indexToUpdate !== -1) {
                // Thực hiện sửa đổi trên phần tử mong muốn
                updatedInstances[indexToUpdate] = updatedInstance;
                // Cập nhật state với mảng mới đã sửa đổi
                page.frameInstanceList = updatedInstances
                updatePage(pageId, page)
            } else {
                console.log('Không tìm thấy phần tử cần sửa đổi.');
            }
        }

    };
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {

        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        setCurrentClassesComponent((event.target as HTMLDivElement).getAttribute("class") || "");
        setDragStart({ x: event.clientX, y: event.clientY });
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>, pageId: string) => {
        console.log(currentClassesComponent.includes('mainComponent'))
        event.preventDefault();

        let frameComponent = document.querySelector('#frameComponent');
        let frameComponentPosition: position = { x: frameComponent?.getBoundingClientRect().left || 0, y: frameComponent?.getBoundingClientRect().top || 0 }

        let textComponent = document.querySelector('#textComponent');
        let textComponentPosition: position = { x: textComponent?.getBoundingClientRect().left || 0, y: textComponent?.getBoundingClientRect().top || 0 }

        let pageComponent = document.querySelector('#' + pageId);
        let pagePosition: position = { x: pageComponent?.getBoundingClientRect().left || 0, y: pageComponent?.getBoundingClientRect().top || 0 }
        console.log({ textPosition: { textComponentPosition }, Mouse: { x: event.clientX, y: event.clientY }, positionStart: { dragStart }, pagePosition: pagePosition, results: { x: textComponentPosition.x - pagePosition.x + event.clientX - dragStart.x, y: textComponentPosition.y - pagePosition.y + event.clientY - dragStart.y } })
        let page = findPage(pageId);
        if (page) {
            if (currentClassesComponent.includes('mainComponent')) {
                if (currentClassesComponent.includes('textComponent')) {
                    const newInstance: TextComponentInstance = {
                        id: 'Text' + nextTextId.toString(),
                        position: { x: textComponentPosition.x - pagePosition.x / scaleValue * 100 + event.clientX / scaleValue * 100 - dragStart.x, y: event.clientY / scaleValue * 100 - pagePosition.y / scaleValue * 100 + textComponentPosition.y - dragStart.y },
                        size: { width: textComponentSize.width, height: textComponentSize.height },
                        text: '',
                        isFocus: false,
                        pageId: pageId
                    };
                    page.textInstanceList.push(newInstance)
                    // setTextInstances([...textInstances, newInstance]);
                    updatePage(pageId, page);
                    setNextTextId(nextTextId + 1);
                    setCurrentClassesComponent("")
                }
                else {
                    const newInstance: ComponentInstance = {
                        id: nextId.toString(),
                        position: {
                            x: frameComponentPosition.x - pagePosition.x / scaleValue * 100 + event.clientX / scaleValue * 100 - dragStart.x, y: event.clientY / scaleValue * 100 - pagePosition.y / scaleValue * 100 + frameComponentPosition.y - dragStart.y
                        },
                        size: { width: frameComponentSize.width, height: frameComponentSize.height },
                        isFocus: false,
                        pageId: pageId,
                        backgroundColor: "#fff"
                    };
                    // setInstances([...instances, newInstance]);
                    page.frameInstanceList.push(newInstance)
                    updatePage(pageId, page);
                    setNextId(nextId + 1);
                    setCurrentClassesComponent("")
                }
            }
            else {
                let page1 = findPage(event.dataTransfer.getData("pageId"))
                if (page1) {
                    if (currentClassesComponent.includes("textComponent")) {
                        let id = event.dataTransfer.getData("Id");
                        const newInstance = page1.textInstanceList.find((instance) => instance.id === id);
                        if (!newInstance) return;
                        const newX = newInstance.position.x + (event.clientX - dragStart.x) / scaleValue * 100;
                        const newY = newInstance.position.y + (event.clientY - dragStart.y) / scaleValue * 100;
                        newInstance.pageId = pageId
                        newInstance.position = { x: newX, y: newY };
                        newInstance.isFocus = true;

                        updateTextInstance(pageId, id, newInstance)
                    }
                    else {
                        let id = event.dataTransfer.getData("Id");
                        const newInstance = page1.frameInstanceList.find((instance) => instance.id === id);
                        if (!newInstance) return;
                        const newX = newInstance.position.x + (event.clientX - dragStart.x) / scaleValue * 100;
                        const newY = newInstance.position.y + (event.clientY - dragStart.y) / scaleValue * 100;
                        // newInstance.isFocus = true;
                        newInstance.pageId = pageId
                        setDisplaymenu(1);
                        newInstance.position = { x: newX, y: newY };
                        updateInstance(pageId, id, newInstance)
                    }
                }
            }
        }

    };

    const updateTextInstance = (pageId: string, idToUpdate: string, updatedInstance: TextComponentInstance) => {
        let page = findPage(pageId);
        if (page) {
            const updatedInstances = page.textInstanceList;

            // Tìm phần tử cần sửa đổi trong mảng sao chép
            const indexToUpdate = updatedInstances.findIndex(instance => instance.id === idToUpdate);
            // Kiểm tra xem phần tử cần sửa có tồn tại trong mảng không
            if (indexToUpdate !== -1) {
                // Thực hiện sửa đổi trên phần tử mong muốn
                updatedInstances[indexToUpdate] = updatedInstance;
                page.textInstanceList = updatedInstances
                updatePage(pageId, page)
            } else {
                console.log('Không tìm thấy trang cần sửa đổi.');
            }
        }
    };
    const handleCreatePage = (e: MouseEvent<HTMLButtonElement>) => {
        const page: Page = {
            id: 'Page' + nextPageId.toString(),
            frameInstanceList: [],
            textInstanceList: [],
        };
        setPages([...pages, page]);
        setNextPageId(nextPageId + 1);
        setNumberOfPages(numberOfPages + 1);
    }
    const handleDeletePage = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        const allPages = [...pages];
        // Tìm phần tử cần sửa đổi trong mảng sao chép
        setPages(allPages.filter(page => page.id !== id));
        setNumberOfPages(numberOfPages - 1);
    }

    const handleClonePage = (e: MouseEvent<HTMLButtonElement>, id: string) => {
        const allPages = [...pages];
        // Tìm phần tử cần sửa đổi trong mảng sao chép
        setPages(allPages.filter(page => page.id !== id));
        setNumberOfPages(numberOfPages - 1);
    }


    return (
        <div className="grid grid-cols-4 h-screen">

            <div className="bg-gray-300 h-full">
                <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                    <span className="sr-only">Open sidebar</span>
                    <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                    </svg>
                </button>
                <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-[24vw] h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                    <div className="h-full px-3 py-4 overflow-y-auto bg-slate-900 dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-design" data-collapse-toggle="dropdown-design">
                                    <div className="w-8">
                                        <i className="fa fa-object-group" aria-hidden="true"></i>
                                    </div>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Design template</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul id="dropdown-design" className="hidden py-2 space-y-2">

                                </ul>
                            </li>
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                    <div className="w-8">
                                        <i className="fa-solid fa-shapes"></i>
                                    </div>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Shape</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul id="dropdown-example" className="hidden py-2 space-y-2">
                                    <li>
                                        <div
                                            id='frameComponent'
                                            className=" bg-gray-300 border border-gray-500 cursor-move mainComponent frameComponent"
                                            style={{ width: frameComponentSize.width, height: frameComponentSize.height }}
                                            draggable="true"
                                            onDragStart={handleDragStart}
                                            onDragOver={(event) => event.preventDefault()}
                                        >
                                        </div>
                                    </li>

                                </ul>
                            </li>
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-text" data-collapse-toggle="dropdown-text">
                                    <div className="w-8">
                                        <i className="fa-solid fa-t"></i>
                                    </div>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Text</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul id="dropdown-text" className="hidden py-2 space-y-2">
                                    <li>
                                        <div
                                            id="textComponent"
                                            draggable="true"
                                            className='text-white w-8 h-8 border border-gray-500 cursor-move mainComponent textComponent'
                                            style={{ width: textComponentSize.width, height: textComponentSize.height }}
                                            onDragStart={handleDragStart}
                                            onDragOver={(event) => event.preventDefault()}
                                        >Text
                                        </div>
                                    </li>
                                    <li>
                                        <div
                                            id="textComponent"
                                            draggable="true"
                                            className='text-white w-8 h-8 border border-gray-500 cursor-move mainComponent textComponent'
                                            style={{ width: textComponentSize.width, height: textComponentSize.height }}
                                            onDragStart={handleDragStart}
                                            onDragOver={(event) => event.preventDefault()}
                                        >Text
                                        </div>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-upload" data-collapse-toggle="dropdown-upload">
                                    <div className="w-8">
                                        <i className="fa fa-cloud-upload" aria-hidden="true"></i>
                                    </div>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Upload</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul id="dropdown-upload" className="hidden py-2 space-y-2">

                                </ul>
                            </li>
                            <li>
                                <button type="button" className="flex items-center w-full p-2 text-base text-gray-300 transition duration-75 rounded-lg group hover:bg-gray-700 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-project" data-collapse-toggle="dropdown-project">
                                    <div className="w-8">
                                        <i className="fa fa-folder-open" aria-hidden="true"></i>
                                    </div>
                                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Project</span>
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                    </svg>
                                </button>
                                <ul id="dropdown-project" className="hidden py-2 space-y-2">

                                </ul>
                            </li>
                        </ul>

                    </div>
                </aside>
            </div>
            <div className="h-full w-full col-span-3">
                <div id="pageContainer" key={calcScaleValue} className="h-[calc(100vh-50px)] w-full overflow-scroll "
                >
                    <div className=" bg-gray-300 min-h-full w-full flex items-center flex-col justify-center pb-32"
                        style={{ transform: calcScaleValue, transformOrigin: "top center" }}
                    >
                        {/* page */}
                        {pages.map((page) => (
                            <div
                                id={page.id}
                                className="bg-white mt-16 drop-shadow-2xl"
                                style={{ width: '210px', height: '297px' }}
                                onDrop={(e) => handleDrop(e, page.id)}
                                onDragOver={(event) => event.preventDefault()}>
                                <div className="absolute"
                                    style={{ top: "0", right: "0", transform: "translate(0,-100%)" }}
                                >
                                    <button data-tooltip-placement="right" data-tooltip-target={"tooltip-new" + page.id} type="button" className="hover:opacity-50 relative h-full w-8 rounded"
                                        onClick={(e) => {
                                            handleCreatePage(e);
                                        }}
                                    >
                                        <i className="fa fa-plus-square-o" aria-hidden="true"></i>
                                    </button>
                                    <div id={"tooltip-new" + page.id} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                        Create new page
                                        <div className="tooltip-arrow" data-popper-arrow></div>
                                    </div>

                                    <button data-tooltip-placement="right" data-tooltip-target={"tooltip-clone" + page.id} type="button" className="hover:opacity-50 relative h-full w-8 rounded"
                                    >
                                        <i className="fa fa-clone " aria-hidden="true"></i>
                                    </button>
                                    <div id={"tooltip-clone" + page.id} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                        Clone this page
                                        <div className="tooltip-arrow" data-popper-arrow></div>
                                    </div>
                                    {numberOfPages > 1 &&
                                        <span>
                                            <button data-tooltip-placement="right" data-tooltip-target={"tooltip-delete" + page.id} type="button" className="hover:opacity-50 relative h-full w-8 rounded"
                                                onClick={(e) => {
                                                    handleDeletePage(e, page.id);
                                                }}
                                            >
                                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                                            </button>
                                            <div id={"tooltip-delete" + page.id} role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                                                Delete this page
                                                <div className="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </span>
                                    }
                                </div>
                                {page.frameInstanceList.map((instance) => (
                                    <div>
                                        <FrameComponent
                                            pageId={page.id}
                                            scaleValue={scaleValue}
                                            cloneInstance={cloneInstance}
                                            deleteInstance={deteleInstance}
                                            setCurrentClassesComponentFunction={setCurrentClassesComponentFunction}
                                            dragStart={dragStart}
                                            setDragStart={setDragStartFunction}
                                            instance={instance}
                                            updateInstance={updateInstance}
                                            displayMenu={displayMenu}
                                            setDisplayMenuFunction={setDisplayMenuFunction} />
                                    </div>
                                ))}
                                {page.textInstanceList.map((instance) => (
                                    <div>
                                        <TextComponent
                                            pageId={page.id}
                                            scaleValue={scaleValue}
                                            cloneInstance={cloneInstance}
                                            deleteInstance={deteleInstance}
                                            setCurrentClassesComponentFunction={setCurrentClassesComponentFunction}
                                            setDragStart={setDragStartFunction}
                                            dragStart={dragStart} instance={instance}
                                            updateInstance={updateTextInstance}
                                            displayMenu={displayMenu}
                                            setDisplayMenuFunction={setDisplayMenuFunction} />
                                    </div>
                                ))}</div>
                        ))}
                        <button type="button" className="bg-gray-400 hover:opacity-50 relative h-full w-[210px] rounded mt-4"
                        >
                            <i className="fa fa-plus-square-o" aria-hidden="true"></i>
                            Add new page
                        </button>
                    </div>


                </div>
                <div className="fixed bottom-0 bg-white w-full">
                    <div className="flex">
                        <div className="relative mb-6 w-64">
                            <label htmlFor="labels-range-input" className="sr-only">Labels range</label>
                            <input id="labels-range-input" type="range" value={scaleValue} onChange={(e) => {
                                setscaleValue(parseInt(e.target.value));
                                setCalcScaleValue("scale(" + (parseInt(e.target.value) / 100).toFixed(2) + ',' + (parseInt(e.target.value) / 100).toFixed(2) + ")");
                                const scrollComponent = document.querySelector('#pageContainer');
                                if (scrollComponent) {
                                    const middlePosition = (scrollComponent.scrollWidth - scrollComponent.clientWidth) / 2;
                                    scrollComponent.scrollLeft = middlePosition;
                                }

                                // Đặt vị trí ban đầu của thanh cuộn

                            }} min="100" max="500" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                        </div>
                        <span>{scaleValue} %</span>
                    </div>
                </div>

            </div>


        </div >

    );
}
