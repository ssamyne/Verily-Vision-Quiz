import styles from './HomePage.module.scss';

import { useState, useEffect } from 'react';
import axios from 'axios';
import SelectedCar from './SelectedCar';
import { newId } from './newId';
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
  // to get current label from api
  const [currentLabel, setCurrentLabel] = useState<SubmitCarData | undefined>();

  // handle selected item
  const selectHandler = (_id: string) => {
    const selectedCar = carsData.find((carData) => carData._id === _id);
    setCurrentCar(selectedCar);
  };

  // handle close selected item
  const selectedCloseHandler = (resetCar: undefined) => {
    setCurrentCar(resetCar);
  };

  // send brand and coordinate via api
  const submitHandler = (finalCarData: SubmitCarData) => {
    const postRequest = async () => {
      try {
        const response = await axios.post(
          'http://13.213.36.162:3000/api/label/v1/create_label',
          {
            image_name: finalCarData.image_name,
            image_label: finalCarData.image_label,
            plate: { coor: finalCarData.plate.coor },
          }
        );

        if (!response) {
          throw new Error('Something went wrong');
        }

        const data = await response.data;
        console.log(data);

        return data;
      } catch (error) {
        console.log(error);
      }
    };

    postRequest();
    alert('submit successfully');
  };

  // fetching cars data first openning
  useEffect(() => {
    const getRequest = async () => {
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
      const data = await getRequest();
      const updatedCarsId = [];
      for (let i = 0; i < data.length; i++) {
        const newData = data[i];
        newData._id = newId[i];

        updatedCarsId.push(newData);
      }

      setCarsData(updatedCarsId);
    };

    readData();
  }, []);

  // getting current label via api
  useEffect(() => {
    const getCurrentLabel = async () => {
      try {
        if (!currentCar) return;

        const response = await axios.get(
          `http://13.213.36.162:3000/api/label/v1/${currentCar._id}`
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

    const readLabel = async () => {
      const data = await getCurrentLabel();

      setCurrentLabel(data);
    };

    readLabel();
  }, [currentLabel, currentCar]);

  return (
    <div className={styles.home}>
      <div className={styles.home__main}>
        {currentCar && (
          <SelectedCar
            currentCar={currentCar}
            currentLabel={currentLabel}
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
