import ReactQuill from 'react-quill';
import { useEffect, useState } from "react";
import 'react-quill/dist/quill.bubble.css';


interface ComponentInstance {
    id: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
}


export default function CVEditor() {
    const [editorValue, setEditorValue] = useState('');
    // document.addEventListener("DOMContentLoaded", function () {
    //     const quill = new Quill('#editor', {
    //         theme: 'snow'
    //     });
    // });
    const [instances, setInstances] = useState<ComponentInstance[]>([]);// framecomponent
    const [textInstances, setTextInstances] = useState<ComponentInstance[]>([]);// textcomponent

    const [nextId, setNextId] = useState(1); //framecomponent
    const [nextTextId, setNextTextId] = useState(1); //textcomponent

    // State để lưu trữ kích thước và vị trí của component
    const frameComponentPosition = { x: 10, y: 10 };
    const frameComponentSize = { width: 100, height: 50 };

    const textComponentPosition = { x: 10, y: 210 };
    const textComponentSize = { width: 100, height: 50 };

    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [SizeStart, setSizeStart] = useState({ width: 0, height: 0 });

    // const [resizeDirection, setResizeDirection] = useState("");
    let resizeDirection = ""
    const [currentClassesComponent, setCurrentClassesComponent] = useState("");
    const [currentIDComponent, setCurrentIDComponent] = useState("");
    // const [currentIdComponent, setCurrentClassesComponent] = useState("");

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        // event.dataTransfer.setData("Id", event.target);
        setCurrentClassesComponent((event.target as HTMLDivElement).getAttribute("class") || "");
        setDragStart({ x: event.clientX, y: event.clientY });
    };

    // Function để xử lý sự kiện thả component

    const updateInstance = (idToUpdate: string, updatedInstance: ComponentInstance, instancesArray: ComponentInstance[], type: string) => {
        // Sao chép mảng state hiện tại
        const updatedInstances = [...instancesArray];

        // Tìm phần tử cần sửa đổi trong mảng sao chép
        const indexToUpdate = updatedInstances.findIndex(instance => instance.id === idToUpdate);

        // Kiểm tra xem phần tử cần sửa có tồn tại trong mảng không
        if (indexToUpdate !== -1) {
            // Thực hiện sửa đổi trên phần tử mong muốn
            updatedInstances[indexToUpdate] = updatedInstance;

            // Cập nhật state với mảng mới đã sửa đổi
            if (type == 'text') {
                setTextInstances(updatedInstances);
            }
            else {
                setInstances(updatedInstances);
            }
        } else {
            console.log('Không tìm thấy phần tử cần sửa đổi.');
        }
    };
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        console.log(currentClassesComponent.includes('mainComponent'))

        event.preventDefault();
        // console.log(currentClassesComponent)
        if (currentClassesComponent.includes('mainComponent')) {
            if (currentClassesComponent.includes('textComponent')) {
                const newInstance: ComponentInstance = {
                    id: 'Text' + nextTextId.toString(),
                    position: { x: textComponentPosition.x + event.clientX - dragStart.x, y: textComponentPosition.y + event.clientY - dragStart.y },
                    size: { width: textComponentSize.width, height: textComponentSize.height },
                };
                setTextInstances([...textInstances, newInstance]);
                setNextTextId(nextTextId + 1);
                setCurrentClassesComponent("")
            }
            else {
                const newInstance: ComponentInstance = {
                    id: nextId.toString(),
                    position: { x: frameComponentPosition.x + event.clientX - dragStart.x, y: frameComponentPosition.y + event.clientY - dragStart.y },
                    size: { width: frameComponentSize.width, height: frameComponentSize.height },
                };
                setInstances([...instances, newInstance]);
                setNextId(nextId + 1);
                setCurrentClassesComponent("")
            }
        }
        else {
            if (currentClassesComponent.includes("textComponent")) {
                // console.log(instances)

                let id = event.dataTransfer.getData("Id");
                // console.log(id)
                const newInstance = textInstances.find((instance) => instance.id === id);
                if (!newInstance) return;
                const newX = newInstance.position.x + event.clientX - dragStart.x;
                const newY = newInstance.position.y + event.clientY - dragStart.y;
                newInstance.position = { x: newX, y: newY };
                updateInstance(id, newInstance, textInstances, 'text')
                // setInstances([...instances]);
                // setPosition({ x: position.x + event.clientX - dragStart.x, y: position.y + event.clientY - dragStart.y });
            }
            else {
                // console.log(instances)

                let id = event.dataTransfer.getData("Id");
                // console.log(id)
                const newInstance = instances.find((instance) => instance.id === id);
                if (!newInstance) return;
                const newX = newInstance.position.x + event.clientX - dragStart.x;
                const newY = newInstance.position.y + event.clientY - dragStart.y;
                newInstance.position = { x: newX, y: newY };
                updateInstance(id, newInstance, instances, '')
                // setInstances([...instances]);
                // setPosition({ x: position.x + event.clientX - dragStart.x, y: position.y + event.clientY - dragStart.y });
            }
        }

    };

    const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>, direction: string) => {
        event.preventDefault();
        event.stopPropagation();
        // Lưu vị trí chuột khi bắt đầu thay đổi kích thước
        setDragStart({ x: event.clientX, y: event.clientY });
        //Tim instance
        const newInstance = instances.find((instance) => instance.id === (event.target as HTMLDivElement).id.split(direction)[1]);
        if (!newInstance) return;
        setSizeStart({ width: newInstance.size.width, height: newInstance.size.height });
        // setResizeDirection(direction);
        resizeDirection = direction;
        setCurrentIDComponent((event.target as HTMLDivElement).id.split(direction)[1])
        // console.log('id', (event.target as HTMLDivElement).id)
        window.addEventListener("mousemove", handleResize);
        window.addEventListener("mouseup", handleResizeEnd);
    };

    // Function để thay đổi kích thước
    const handleResize = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const newInstance = instances.find((instance) => instance.id === currentIDComponent);
        console.log(newInstance)
        if (!newInstance) return;
        //
        let newWidth = newInstance.size.width;
        let newHeight = newInstance.size.height;
        let newX = newInstance.position.x;
        let newY = newInstance.position.y;
        switch (resizeDirection) {
            case "right":
                newWidth = SizeStart.width + (event.clientX - dragStart.x);
                // alert("oke")
                break;
            case "bottom":
                newHeight = SizeStart.height + (event.clientY - dragStart.y);

                break;
            case "left":
                newWidth = SizeStart.width - (event.clientX - dragStart.x);
                // setPosition({ x: position.x - (dragStart.x - event.clientX), y: position.y });
                newX = newX - (dragStart.x - event.clientX)
                break;
            case "top":
                newHeight = SizeStart.height - (event.clientY - dragStart.y);
                // setPosition({ x: position.x, y: position.y - (dragStart.y - event.clientY) });
                newY = newY - (dragStart.y - event.clientY)
                break;
        }
        //
        newInstance.position = { x: newX, y: newY };
        newInstance.size = { width: newWidth, height: newHeight };
        updateInstance(currentIDComponent, newInstance)
        setDragStart({ x: event.clientX, y: event.clientY })


        // Tính toán kích thước mới của component dựa trên vị trí mới của chuột
        // const newWidth = size.width + (resizeDirection.includes("right") ? event.clientX - dragStart.x : dragStart.x - event.clientX);
        // const newHeight = size.height + (resizeDirection.includes("bottom") ? event.clientY - dragStart.y : dragStart.y - event.clientY);

        // newWidth = size.width + (event.clientX - dragStart.x);



        // Cập nhật kích thước và vị trí của component
        // setSize({ width: newWidth, height: newHeight });
        // setPosition({ x: resizeDirection.includes("right") ? position.x : position.x - (dragStart.x - event.clientX), y: resizeDirection.includes("bottom") ? position.y : position.y - (dragStart.y - event.clientY) });

        // Cập nhật vị trí chuột mới
        setDragStart({ x: event.clientX, y: event.clientY });
        return;
    };

    // Function để kết thúc quá trình thay đổi kích thước
    const handleResizeEnd = () => {
        // setResizeDirection("");
        resizeDirection = "";
        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("mouseup", handleResizeEnd);
    };


    return (
        <div className="grid grid-cols-4 h-screen">

            <div className="bg-gray-300 h-full">1
                <div
                    className=" absolute bg-gray-300 border border-gray-500 cursor-move mainComponent frameComponent"
                    style={{ width: frameComponentSize.width, height: frameComponentSize.height, left: frameComponentPosition.x, top: frameComponentPosition.y }}
                    draggable="true"
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                </div>
                <div
                    draggable="true"
                    className='w-8 h-8 absolute bg-gray-300 border border-gray-500 cursor-move mainComponent textComponent'
                    style={{ width: textComponentSize.width, height: textComponentSize.height, left: textComponentPosition.x, top: textComponentPosition.y }}

                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                    {/* <ReactQuill className='border-2'
                        value={editorValue}
                        onChange={(value) => setEditorValue(value)}
                        // modules={{
                        //     toolbar: [
                        //         [{ header: [1, 2, false] }],
                        //         ['bold', 'italic', 'underline'],
                        //         ['image', 'code-block']
                        //     ]
                        // }}
                        theme="bubble"
                    /> */}
                </div>
            </div>
            <div className="bg-red-300 h-full col-span-3"
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}>2
                {instances.map((instance) => (
                    <div
                        id={instance.id}
                        className="absolute bg-gray-300 border border-gray-500 cursor-move"
                        style={{
                            width: instance.size.width,
                            height: instance.size.height,
                            left: instance.position.x,
                            top: instance.position.y,
                        }}
                        draggable="true"
                        onDragStart={handleDragStart}
                    // onDrop={handleDrop}
                    // onDragOver={(event) => event.preventDefault()}

                    // onDrag={(event) => handleResize(event, instance.id)}
                    >
                        <div
                            id={'left' + instance.id}
                            className="absolute w-1 h-4 bg-blue-500 cursor-pointer"
                            style={{ top: "50%", left: "-2px", transform: "translateY(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "left")}
                            onMouseMove={(e) => resizeDirection === "left" ? handleResize : undefined}
                            onMouseUp={handleResizeEnd}
                        />
                        <div
                            id={'top' + instance.id}
                            className="absolute w-4 h-1 bg-blue-500 cursor-pointer"
                            style={{ top: "-2px", left: "50%", transform: "translateX(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "top")}
                            onMouseMove={(e) => resizeDirection === "top" ? handleResize : undefined}
                            onMouseUp={handleResizeEnd}
                        />
                        <div
                            id={'bottom' + instance.id}
                            className="absolute w-4 h-1 bg-blue-500 cursor-pointer"
                            style={{ bottom: "-2px", left: "50%", transform: "translateX(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "bottom")}
                            onMouseMove={(e) => resizeDirection === "bottom" ? handleResize : undefined}
                            onMouseUp={handleResizeEnd}
                        />
                        <div
                            id={'right' + instance.id}
                            className="absolute w-1 h-4 bg-blue-500 cursor-pointer"
                            style={{ top: "50%", right: "-2px", transform: "translateY(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "right")}
                            onMouseMove={(e) => resizeDirection === "right" ? undefined : {
                                handleResize
                            }}
                            onMouseUp={handleResizeEnd}
                        />
                    </div>
                ))}
                {textInstances.map((instance) => (
                    <div
                        id={instance.id}
                        className="absolute bg-gray-300 border border-gray-500 cursor-move textComponent"
                        style={{
                            width: instance.size.width,
                            height: instance.size.height,
                            left: instance.position.x,
                            top: instance.position.y,
                        }}
                        draggable="true"
                        onDragStart={handleDragStart}
                    // onDrop={handleDrop}
                    // onDragOver={(event) => event.preventDefault()}

                    // onDrag={(event) => handleResize(event, instance.id)}
                    >
                        {/* <ReactQuill className='border-2'
                            value={editorValue}
                            onChange={(value) => setEditorValue(value)}
                            // modules={{
                            //     toolbar: [
                            //         [{ header: [1, 2, false] }],
                            //         ['bold', 'italic', 'underline'],
                            //         ['image', 'code-block']
                            //     ]
                            // }}
                            theme="bubble"
                        /> */}
                        <div
                            id={'left' + instance.id}
                            className="absolute w-1 h-4 bg-blue-500 cursor-pointer"
                            style={{ top: "50%", left: "-2px", transform: "translateY(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "left")}
                            onMouseMove={(e) => resizeDirection === "left" ? handleResize : undefined}
                            onMouseUp={handleResizeEnd}
                        />
                        <div
                            id={'top' + instance.id}
                            className="absolute w-4 h-1 bg-blue-500 cursor-pointer"
                            style={{ top: "-2px", left: "50%", transform: "translateX(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "top")}
                            onMouseMove={(e) => resizeDirection === "top" ? handleResize : undefined}
                            onMouseUp={handleResizeEnd}
                        />
                        <div
                            id={'bottom' + instance.id}
                            className="absolute w-4 h-1 bg-blue-500 cursor-pointer"
                            style={{ bottom: "-2px", left: "50%", transform: "translateX(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "bottom")}
                            onMouseMove={(e) => resizeDirection === "bottom" ? handleResize : undefined}
                            onMouseUp={handleResizeEnd}
                        />
                        <div
                            id={'right' + instance.id}
                            className="absolute w-1 h-4 bg-blue-500 cursor-pointer"
                            style={{ top: "50%", right: "-2px", transform: "translateY(-50%)" }}
                            onMouseDown={(e) => handleResizeStart(e, "right")}
                            onMouseMove={(e) => resizeDirection === "right" ? undefined : {
                                handleResize
                            }}
                            onMouseUp={handleResizeEnd}
                        />
                    </div>
                ))}</div>
        </div >

    );
}
