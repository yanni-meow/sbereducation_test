import { useEffect, useState } from 'react';
import { Dropdown } from './components/dropdown/dropdown';
import './App.scss';

function App() {

  const [selectDataFirst, setSelectDataFirst] = useState([])
  const [allGroupsList, setAllGroupsList] = useState({})
  const [choice, setChoice] = useState([])

  // запроос к апи для получения данных
  const APIurl = 'https://restcountries.eu/rest/v2/all'
  const getSelectCountries = () => {
    fetch(APIurl)
      .then((result) => result.json())
      .then((result) => {
        return setSelectDataFirst(result)
      })
      .catch((e) => console.log(e))
  }
  useEffect(() => getSelectCountries(), [])

  // формирование групп по завершении ожидания ответа от апи
  useEffect(() => createGroups(), [selectDataFirst])

  // создание групп происходит вне компонента, для формирования понятной компоненту структуры данных
  const createGroups = () => {
    const groups = {}
    console.log('createGroups', selectDataFirst);
    selectDataFirst.forEach(item => {
      const keys = Object.keys(selectDataFirst);
      if(keys.length && item.region.length) {
          keys.forEach((key) => {
              if (key !== item.region) {
                  groups[item.region] = []
              }
          })
      } else {
          if (item.region.length) groups[item.region] = []
      }
    })        

    selectDataFirst.forEach(item => {
      if (item.region.length) {
          groups[item.region].push(item)
      }
    })

    if (Object.keys(groups).length) setAllGroupsList(groups)
  }

  // вывод таблиц выбранных данных (для наглядности)
  const choiceTable = () => {
    const table = choice.map((el) => {
      return (
        <tr key={el.name}>
          <td>{el.name}</td>
          <td>{el.population}</td>
          <td>{el.region}</td>
          <td>{el.subregion}</td>
        </tr>
      )
    })
    return table
  }

  return (
    <div className="container">

    {/* рендер происходит только после формирования всех групп для отображения в dropdown */}
      {!Object.keys(allGroupsList).length ? 
        'loading' :
        <Dropdown 
        // данные разделенные по группам
            groups={allGroupsList}
        //поле объекта выводящееся в список опшинов
            options='name'
        // state для созранения выбранных данных
            choice={choice}
            setChoice={setChoice}
        
        // необязательные пропсы стилей
            widthInput='340px'
            widthList='100%'
            heightList='50vh'
        /> 
      }

      <div className='result'>
        <h1>your choice</h1>
        <table>
          <thead>
            <tr>
              <th>name</th>
              <th>population</th>
              <th>region</th>
              <th>subregion</th>
            </tr>
          </thead>
          <tbody>
              {choiceTable()}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;
