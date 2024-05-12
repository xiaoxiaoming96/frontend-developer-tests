import { useCallback, useEffect, useState } from 'react';
import './App.css';

function App() {
  const [countryList, setCountryList] = useState<Array<Record<string, any>>>([])
  const [showUserListIndex, setShowUserListIndex] = useState(-1)
  const [generFilterKey, setGenerFilterKey] = useState('all')
  useEffect(()=>{
    fetch('https://randomuser.me/api/?results=100').then((res)=>{
      res.json().then((data) => {
        const { results } = data || {}
        const map = new Map<string, Record<string, any>>()
        results.forEach((user: Record<string, any>)=>{
          const { country } = user.location
          if(map.has(country)) {
            map.get(country)?.push(user)
          } else {
            map.set(country, [user])
          }
        })
        const newCountryList = Array.from(map).sort((a,b) => {
          return b[1].length - a[1].length
        }).map((item)=>{
          item[1].sort((a: Record<string, any>, b: Record<string, any>)=>{
            return new Date(b.registered.date).getTime() - new Date(a.registered.date).getTime()
          })
          return item
        })
        setCountryList(newCountryList)
      }) 
    })
  }, [])
  const onCountryItemClick = useCallback((index: number)=>{
    setShowUserListIndex(index)
    if(showUserListIndex !== index) setGenerFilterKey('all')
  }, [setShowUserListIndex])
  const onGenderFilterSelect = useCallback((val: string)=>{
    setGenerFilterKey(val)
  }, [setGenerFilterKey])
  return (
    <div className='country-users-box'>
      {countryList.map((countryInfo: any, index)=> 
        <div className="country-item">
          <div onClick={()=>{
            onCountryItemClick(index)
          }}>{countryInfo?.[0]}</div>
          {index === showUserListIndex ? 
          <div>
              <label>
                Gender:
                <select onChange={(event)=>{
                  onGenderFilterSelect(event.target.value)
                }} style={{ marginLeft: '5px'}}>
                  <option value="all">All</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
              {countryInfo?.[1]?.filter((userInfo: Record<string, any>)=>{
                if(generFilterKey === 'all') return true
                if(generFilterKey === userInfo.gender) return true
              }).map((userInfo: Record<string, any>)=>{
                return (
                  <div className='user-item'>
                    <div>{`${userInfo.name.first} ${userInfo.name.last}`}</div>
                    <div>{userInfo.gender}</div>
                    <div>{userInfo.location.city}</div>
                    <div>{userInfo.location.state}</div>
                    <div>{userInfo.registered.date}</div>
                  </div>
                )
              })}
          </div> : null}
        </div>
      )}
    </div>
  );
}

export default App;
