import React, { useState } from 'react'
import { Collapse, Checkbox } from 'antd';

const { Panel } = Collapse;

function CheckBox(props) {

    const [Checked, setChecked] = useState([])
    
    const handleToggle = (value) => {
        // 선택한 CheckBox의 Index를 구하고
        const currentIndex = Checked.indexOf(value)

        // 전체 Checked된 State에서 현재 누른 CheckBox가
        const newChecked = [...Checked]
        
        if(currentIndex === -1) { // 없으면 추가하고
            newChecked.push(value)
        } else { // 있으면 제거한다
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked)
    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key={index}>
            <Checkbox onChange={()=> handleToggle(value._id)} 
                    checked={Checked.indexOf(value._id) === -1? false : true} />
            <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="This is panel header 1" key="1">
                    {
                        renderCheckboxLists()
                    }
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox