import styles from './HomePage.module.scss';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Canvas from './Canvas';

interface CarData {
  _id: string;
  url: string;
  image_name: string;
  created_date: string;
}

const HomePage = () => {
  const [carsData, setCarsData] = useState<CarData[]>([]);
  const [currentCar, setCurrentCar] = useState<CarData | undefined>();
  const [inputLabel, setInputLabel] = useState('');
  const imgRef = useRef<HTMLDivElement | null>(null);

  const selectHandler = (_id: string) => {
    const selectedCar = carsData.find((carData) => carData._id === _id);
    setCurrentCar(selectedCar);
  };

  const selectedCloseHandler = () => {
    setCurrentCar(undefined);
  };

  const setLabelHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const inputValue = event.target.value;
    setInputLabel(inputValue);
  };

  useEffect(() => {
    const sendRequest = async () => {
      try {
        const response = await axios.get(
          'http://13.213.36.162:3000/api/image/v1'
        );

        if (!response) {
          throw new Error('Something went wrong');
        }

        const data = await response.data;

        return data;
      } catch (error) {
        console.log(error);
      }
    };

    const readData = async () => {
      const data = await sendRequest();

      setCarsData(data);
    };

    readData();
  }, []);

  return (
    <div className={styles.home}>
      <Canvas />
      <div className={styles.home__main} ref={imgRef}>
        {currentCar && (
          <div className={styles.selected}>
            <div
              className={styles.selected__backdrop}
              onClick={selectedCloseHandler}
            ></div>
            <div className={styles.selected__container}>
              <img
                className={styles.selected__image}
                src={currentCar.url}
                alt='selected car'
              />
              <div className={styles.selected__tools}>
                <h2 className={styles.tools__heading}>
                  {currentCar.image_name}
                </h2>
                <label className={styles.tools__label} htmlFor={currentCar._id}>
                  Brand &#x3A;
                </label>
                <input
                  className={styles.tools__input}
                  id={currentCar._id}
                  type='text'
                  placeholder='Car Brand'
                  onChange={setLabelHandler}
                  value={inputLabel}
                />
                <button className={styles.btn_main}>change</button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.main__list}>
          {carsData.map((carObj, index) => {
            const { _id, url, image_name, created_date } = carObj;
            return (
              <button
                className={styles.main__item}
                key={index}
                onClick={selectHandler.bind(null, _id)}
              >
                <img
                  className={styles.main__item_image}
                  src={url}
                  alt={`car ${image_name}`}
                />
                <h2 className={styles.main__item_label}>{image_name} </h2>
                <h2 className={styles.main__item_date}>( {created_date} )</h2>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
