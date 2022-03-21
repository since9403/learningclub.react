import React, { useState } from 'react'

import { Collapse, Radio } from 'antd'

function RadioBox(props) {

    const { Panel } = Collapse;
    const [Value, setValue] = useState(0)

    const renderRadioBoxLists = () => (
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}>{value.name}</Radio>
        ))
    )

    const handleChange = (event) => {
        setValue(event.target.value)
        props.handleFilters(event.target.value)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']}>
                <Panel header="Price" key="1">
                    <Radio.Group onChange={handleChange} value={Value}>
                        {/* onChange에서 Radio의 value로 Value state을 업데이트. Radio.Group의 Value가 선택된 Radio이다 */}
                        {
                            renderRadioBoxLists()
                        }
                    </Radio.Group>
                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox