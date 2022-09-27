import styles from './HomePage.module.scss';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SelectedCar from './SelectedCar';

export interface CarData {
  _id: string;
  url: string;
  image_name: string;
  created_date: string;
}

export interface SubmitCarData {
  _id: string;
  image_name: string;
  image_label: string;
  plate: { coor: number[] };
}

const HomePage = () => {
  // store all car data from fetching
  const [carsData, setCarsData] = useState<CarData[]>([]);
  // to get current car that should show in selected item
  const [currentCar, setCurrentCar] = useState<CarData | undefined>();

  // handle selected item
  const selectHandler = (_id: string) => {
    const selectedCar = carsData.find((carData) => carData._id === _id);
    setCurrentCar(selectedCar);
  };

  const selectedCloseHandler = (resetCar: undefined) => {
    setCurrentCar(resetCar);
  };

  // send brand and coordinate via api
  const submitHandler = (finalCarData: SubmitCarData) => {
    console.log(finalCarData);

    alert('submit successfully');
  };

  // fetching cars data first openning
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
          <SelectedCar
            currentCar={currentCar}
            resetCurrentCar={selectedCloseHandler}
            onSubmit={submitHandler}
          />
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
