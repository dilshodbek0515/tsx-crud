import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react'
import { Foods, initialState, LoginForm } from '../../types'
import axios from 'axios'

const Crud: FC = () => {
  const [food, setFood] = useState<null | Foods[]>(null)
  const [value, setValue] = useState<LoginForm>(initialState)
  const [editId, setEditId] = useState<number | null>(null)

  const fetchFoods = () => {
    axios
      .get('https://672f3e4f229a881691f24b98.mockapi.io/food')
      .then(res => setFood(res.data))
      .catch(err => console.log(err))
  }

  const createFood = () => {
    if (editId) {
      axios
        .put(
          `https://672f3e4f229a881691f24b98.mockapi.io/food/${editId}`,
          value
        )
        .then(res => {
          setFood(
            prev =>
              prev?.map(item => (item.id === editId ? res.data : item)) || []
          )
          setEditId(null)
          setValue(initialState)
        })
        .catch(err => console.log(err))
    } else {
      axios
        .post('https://672f3e4f229a881691f24b98.mockapi.io/food', value)
        .then(res => {
          setFood(prev => (prev ? [...prev, res.data] : [res.data]))
          setValue(initialState)
        })
        .catch(err => console.log(err))
    }
  }

  const deleteFood = (id: number) => {
    axios
      .delete(`https://672f3e4f229a881691f24b98.mockapi.io/food/${id}`)
      .then(() => {
        setFood(prev => prev?.filter(item => item.id !== id) || [])
      })
      .catch(err => console.log(err))
  }

  const editFood = (id: number) => {
    const selectedFood = food?.find(item => item.id === id)
    if (selectedFood) {
      setEditId(id)
      setValue({
        url: selectedFood.url,
        title: selectedFood.title,
        description: selectedFood.description,
        oldPrice: selectedFood.oldprice,
        price: selectedFood.price
      })
    }
  }
  useEffect(() => {
    fetchFoods()
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    createFood()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target
    setValue(prev => ({ ...prev, [name]: value }))
  }

  const FOODS: JSX.Element[] | undefined = food?.map(
    (food: Foods): JSX.Element => (
      <div
        className='h-auto shadow-2xl bg-blue-800 rounded-2xl p-5 flex gap-3 items-center justify-between flex-col'
        key={food.id}
      >
        <img
          className='w-full h-[50%] rounded-lg'
          src={food.url}
          alt={food.title}
        />
        <h2 className='text-4xl text-white'>{food.title}</h2>
        <p className='text-lg text-center text-white opacity-50'>
          {food.description}
        </p>
        <div className='w-full h-auto flex justify-between'>
          <del className='text-xl text-red-600'>{food.oldprice} 00 $</del>
          <p className='text-xl text-green-500'>{food.price} 00 $</p>
        </div>
        <div className='w-full h-auto flex justify-between'>
          <button
            onClick={() => editFood(food.id)}
            className='w-32 bg-orange-400 py-2 px-10 rounded-lg text-center whitespace-nowrap flex items-center justify-center text-white hover:opacity-75'
          >
            Edit
          </button>
          <button
            onClick={() => deleteFood(food.id)}
            className='w-32 bg-red-600 py-2 px-10 rounded-lg text-center whitespace-nowrap flex items-center justify-center text-white hover:opacity-75'
          >
            Delete
          </button>
        </div>
      </div>
    )
  )

  return (
    <div className='w-full h-auto flex flex-col gap-10'>
      <form
        onSubmit={handleSubmit}
        className='container px-40 mx-auto bg-slate-900 flex flex-col items-center justify-center gap-5 p-10 rounded-2xl'
      >
        <input
          value={value.url}
          className='w-full h-16 rounded-xl border-2 border-white bg-transparent text-white outline-none px-5 py-2'
          placeholder='Url'
          name='url'
          type='text'
          required
          onChange={handleChange}
        />
        <input
          value={value.title}
          className='w-full h-16 rounded-xl border-2 border-white bg-transparent text-white outline-none px-5 py-2'
          placeholder='Title'
          name='title'
          type='text'
          required
          onChange={handleChange}
        />
        <input
          value={value.description}
          className='w-full h-16 rounded-xl border-2 border-white bg-transparent text-white outline-none px-5 py-2'
          placeholder='Description'
          name='description'
          type='text'
          required
          onChange={handleChange}
        />
        <input
          value={value.oldPrice}
          className='w-full h-16 rounded-xl border-2 border-white bg-transparent text-white outline-none px-5 py-2'
          placeholder='oldPrice'
          name='oldPrice'
          type='number'
          required
          onChange={handleChange}
        />
        <input
          value={value.price}
          className='w-full h-16 rounded-xl border-2 border-white bg-transparent text-white outline-none px-5 py-2'
          placeholder='Price'
          name='price'
          type='number'
          required
          onChange={handleChange}
        />
        <button className='w-96 h-16 bg-green-500 rounded-xl text-white text-2xl hover:opacity-75'>
          {editId ? 'Update' : 'Create'}
        </button>
      </form>
      <div className='container mx-auto shadow-2xl bg-slate-900 p-5 rounded-xl grid grid-cols-4 gap-5 h-auto'>
        {FOODS}
      </div>
    </div>
  )
}

export default Crud
