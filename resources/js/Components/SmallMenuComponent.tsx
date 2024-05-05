import { ComponentInstance } from '@/types';
import { MouseEvent, useState } from 'react';
import { ColorResult, SketchPicker } from 'react-color';

interface SmallMenuComponentProps {
    id: string
    deleteInstance: (pageId: string, id: string) => void
    cloneInstance: (pageId: string, id: string) => void
    pageId: string
    updateInstance: (pageId: string, id: string, updatedInstance: ComponentInstance) => void
    instance: ComponentInstance
    displayMenu: number
    setDisplayMenuFunction: (x: number) => void
    isInMenu: boolean
    setIsInMenuFunction: (x: boolean) => void
}

const SmallMenuComponent: React.FC<SmallMenuComponentProps> = (props) => {
    // if (props.displayMenu != 'visible' && props.displayMenu != 'hidden') {
    //     visibilityValue = 'visible'; // Nếu displayMenu là true, hiển thị phần tử
    // }
    const [background, setBackground] = useState<ColorResult>();
    const [showColorPicker, setShowColorPicker] = useState(false);
    const handleDelete = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        props.deleteInstance(props.pageId, props.id)
    }
    const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        props.cloneInstance(props.pageId, props.id)
    }

    return (
        <div
            id={'menu' + props.id}
            className="absolute w-28 h-8 bg-white border border-gray-500/80 cursor-pointer rounded"
            style={{ opacity: props.displayMenu, top: "0", right: "50%", transform: "translate(50%,-130%)" }}
            onMouseEnter={(e) =>
                props.setIsInMenuFunction(true)
            }
            onMouseLeave={(e) =>
                props.setIsInMenuFunction(false)
            }
        >
            <div className="h-full w-full flex item-center justify-between"
            >
                <button type="button" className="hover:bg-gray-500 relative h-full w-8 bg-white rounded"
                    onMouseDown={handleCopy}
                >
                    <i className="fa-solid fa-copy"></i>
                </button>
                <button type="button" className="hover:bg-gray-500 relative h-full w-8 bg-white rounded"
                    onMouseDown={handleDelete}>
                    <i className="fa-solid fa-trash-can"></i>
                </button>
                <button type="button" className="hover:bg-gray-500 relative h-full w-8 bg-white rounded"
                    onClick={(e) => {
                        if (showColorPicker) {
                            setShowColorPicker(false)
                        }
                        else {
                            setShowColorPicker(true)
                        }
                    }}>
                    <i className="fa fa-picture-o" aria-hidden="true"></i>
                </button>
                <div className='absolute'
                    style={{ top: "0", right: "0", transform: "translate(110%,0%)" }}
                >
                    {showColorPicker && <SketchPicker
                        color={background?.hex}
                        onChangeComplete={(color) => {
                            setBackground(color)
                            props.instance.backgroundColor = color.hex;
                            props.updateInstance(props.pageId, props.id, props.instance);
                        }}
                    />}
                </div>
                <button type="button" className="hover:bg-gray-500 relative h-full w-8 bg-white rounded">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>


            </div>
        </div>
    )
}

export default SmallMenuComponent;