import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateRoom } from '../../redux/rooms'
import { updateSelectedRoom } from '../../redux/common'
import bedImg from '../assets/svg/kingBed.svg'
import { GiCutDiamond } from 'react-icons/gi'

export default function RoomControls() {
  const { selectedRoom, positions } = useSelector((state) => state.common)
  const { builtLength, builtBreadth, scale } = useSelector((state) => state.plot)
  const { bedrooms } = useSelector((state) => state.rooms)
  const [position, setPosition] = useState(0)
  const [length, setLength] = useState(selectedRoom?.data?.length)
  const [breadth, setBreadth] = useState(selectedRoom?.data?.breadth)
  const [maxX, setMaxX] = useState(0)
  const [maxY, setMaxY] = useState(0)
  const [selectedBedroom, setSelectedBedroom] = useState(null)
  const dispatch = useDispatch()

  const [direction, setDirection] = useState(null)
  const [room, setRoom] = useState(null)

  const [customize, setCustomize] = useState(false)

  useEffect(() => {
    calculateMaxX()
  }, [builtLength, builtBreadth, selectedRoom])

  const calculateMaxX = () => {
    setMaxX(parseInt(parseFloat(builtLength) * scale - parseFloat(selectedRoom?.data?.length) * scale))
    setMaxY(parseInt(parseFloat(builtBreadth) * scale - parseFloat(selectedRoom?.data?.breadth) * scale))
  }

  useEffect(() => {
    dispatch(updateRoom({ position, length, breadth, room: selectedRoom?.room, id: selectedRoom?.data?.id }))
  }, [length, breadth, position])

  const handleChange = (e) => {
    if (e.target.value) {
      const { name, value } = e.target
      setPosition({ ...position, [name]: value })
    }
  }
  const handleSelectChange = (e) => {
    if (e.target.value === 'default') setSelectedBedroom(null)
    else setSelectedBedroom(e.target.value)
    dispatch(updateSelectedRoom({ data: bedrooms.find((room) => room.id == e.target.value) }))
  }

  console.log('DIRECTION=>' + direction + ' ROOM=>' + room)

  useEffect(() => {
    setRoom(null)
  }, [direction])

  return (
    <>
      {/* MIAN CONTROLS */}
      {/* <div className='bg-primaryLime w-full px-3 rounded-lg font-bold my-3'>Main Controls</div> */}
      <div className='w-full flex mt-2 '>
        <div className='flex flex-col w-full gap-3'>
          <select className='bg-primaryLime rounded-lg w-full h-[32px]' onChange={(e) => setDirection(e.target.value)}>
            <option value='default'>Select Position</option>
            <option value='NW'>North West</option>
            <option value='NE'>North East</option>
            <option value='SW'>South West</option>
            <option value='SE'>South East</option>
          </select>
          <select
            className='bg-primaryLime rounded-lg w-full h-[32px]'
            disabled={!direction}
            defaultValue={null}
            onChange={(e) => setRoom(e.target.value)}>
            <option value={null}>Select Room</option>
            <option value={`bedroom-${direction}`}>Bedroom</option>
            <option value='kitchen'>Kitchen</option>
            <option value='living'>Living</option>
            <option value='drawing'>Drawing</option>
            <option value='dining'>Dining</option>
            <option value='media'>Media</option>
            <option value='sitout'>Sitout</option>
            <option value='staircase'>Staircase</option>
            <option value='store'>Store</option>
            <option value='office'>Office</option>
          </select>
        </div>
        <div className='w-1/2 flex flex-col items-start px-3'>
          <div className='flex items-center justify-center gap-2'>
            <input type='radio' name='toilet' disabled={!selectedBedroom} />
            <div>Bath+WC+Shower</div>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <input type='radio' name='toilet' defaultChecked disabled={!selectedBedroom} />
            <div>Bath+WC</div>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <input type='radio' name='toilet' disabled={!selectedBedroom} />
            <div>WC</div>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <input type='radio' name='toilet' disabled={!selectedBedroom} />
            <div>None</div>
          </div>
          <div className='h-[2px] bg-[#d9fc35] w-full' />
          <div className='flex items-center justify-center gap-2'>
            <input type='checkbox' disabled={!selectedBedroom} />
            <div>Wardrobe</div>
          </div>
          <div className='flex items-center justify-center gap-2'>
            <input type='checkbox' disabled={!selectedBedroom} />
            <div>Balcony</div>
          </div>
        </div>
      </div>
      {/* MAIN CONTROLS END */}
      {/* ROOM CONTROLS */}
      <div className='bg-primaryLime w-full px-3 rounded-lg font-bold mt-3 capitalize flex items-center'>
        <div>Room Controls : {selectedBedroom ? `Bedroom - ${selectedBedroom}` : 'No room selected'}</div>
        <button onClick={() => setCustomize((prev) => !prev)}>
          <GiCutDiamond size={24} />
          Customize
        </button>
      </div>
      {customize && (
        <>
          <div className='w-full flex mt-2 bg-slate-900 text-primaryLime px-3 rounded-lg'>
            <div>Position</div>
          </div>
          <div className='mt-2 font-semibold text-sm'>X-Direction</div>
          <div className='w-full flex gap-3 '>
            <input
              className='w-2/3 cursor-pointer'
              type='range'
              min={Math.min(...positions.x)}
              max={maxX}
              step={0.5}
              name='x'
              defaultValue={0}
              onChange={handleChange}
              disabled={selectedRoom?.data === undefined}
            />
            <input
              input='text'
              className='w-1/3 border-primaryLime border-2 rounded-lg px-3 outline-none'
              value={position.x}
              disabled={selectedRoom?.data === undefined}
            />
          </div>
          <div className='mt-2 font-semibold text-sm'>Y-Direction</div>
          <div className='w-full flex gap-3 '>
            <input
              type='range'
              className='w-2/3 cursor-pointer'
              min={Math.min(...positions.y)}
              max={maxY}
              step={0.5}
              name='y'
              defaultValue={0}
              onChange={handleChange}
              disabled={selectedRoom?.data === undefined}
            />
            <input
              input='number'
              className='w-1/3 border-primaryLime border-2 rounded-lg px-3 outline-none'
              value={position.y}
              disabled={selectedRoom?.data === undefined}
            />
          </div>
          <div className='w-full flex mt-2 bg-slate-900 text-primaryLime px-3 rounded-lg'>
            <div>Dimensions</div>
          </div>
          <div className='mt-2 font-semibold text-sm'>Length</div>
          <div className='w-full flex gap-3 '>
            <input
              type='range'
              className='w-2/3 cursor-pointer'
              min={selectedRoom?.data?.minLength}
              max={selectedRoom?.data?.maxLength}
              step={0.01}
              name='length'
              defaultValue={length ? length : 0}
              onChange={(e) => setLength(e.target.value)}
              disabled={selectedRoom?.data === undefined}
            />
            <input
              input='number'
              className='w-1/3 border-primaryLime border-2 rounded-lg px-3 outline-none'
              onChange={(e) => setLength(e.target.value)}
              value={length}
              disabled={selectedRoom?.data === undefined}
            />
          </div>
          <div className='mt-2 font-semibold text-sm'>Breadth</div>
          <div className='w-full flex gap-3 '>
            <input
              type='range'
              className='w-2/3'
              min={selectedRoom?.data?.minBreadth}
              max={selectedRoom?.data?.maxBreadth}
              step={0.01}
              name='breadth'
              defaultValue={breadth ? breadth : 0}
              onChange={(e) => setBreadth(e.target.value)}
              disabled={selectedRoom?.data === undefined}
            />
            <input
              input='text'
              className='w-1/3 border-primaryLime border-2 rounded-lg px-3 outline-none'
              onChange={(e) => setLength(e.target.value)}
              value={breadth}
              disabled={selectedRoom?.data === undefined}
            />
          </div>
          {/* ROOM CONTROLS END */}
          {/* ICONS */}
          <div className='bg-primaryLime w-full px-3 rounded-lg font-bold mt-3'>Icons : Bed</div>
          <div className='mt-3 flex flex-wrap w-full items-center justify-center gap-6'>
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
            <img src={bedImg} alt='bed' className='w-20' />
          </div>
        </>
      )}
      {/* ICONS END */}
    </>
  )
}
