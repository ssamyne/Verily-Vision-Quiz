import styles from './HomePage.module.scss';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface CarData {
  _id: string;
  url: string;
  image_name: string;
  created_date: string;
}

const HomePage = () => {
  const [carsData, setCarsData] = useState<CarData[]>([]);
  const [currentCar, setCurrentCar] = useState<CarData | undefined>();

  const selectHandler = (_id: string) => {
    const selectedCar = carsData.find((carData) => carData._id === _id);
    setCurrentCar(selectedCar);
  };

  const selectedCloseHandler = () => {
    setCurrentCar(undefined);
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
      <div className={styles.home__main}>
        {currentCar && (
          <div className={styles.main__selected} onClick={selectedCloseHandler}>
            <div className={styles.main__selected_container}>
              <img
                className={styles.main__selected_image}
                src={currentCar.url}
                alt='selected car'
              />
              <div className={styles.main__selected_tools}></div>
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
