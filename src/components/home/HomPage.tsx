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
  // store all car data from fetching
  const [carsData, setCarsData] = useState<CarData[]>([]);
  // to get current car that should show in selected item
  const [currentCar, setCurrentCar] = useState<CarData | undefined>();
  // to get image width and heigh ref
  const imgRef = useRef<HTMLDivElement | null>(null);
  // set canvas dimension dynamically
  const [dimension, setDimention] = useState({ width: 0, height: 0 });
  // for cropping button
  const [isAllow, setIsAllow] = useState(false);

  // brand input storage
  const [inputLabel, setInputLabel] = useState('');
  // Coordinate input storage
  const [finalCoordinate, setFinalCoordinate] = useState<number[]>([]);

  // handle selected item
  const selectHandler = (_id: string) => {
    const selectedCar = carsData.find((carData) => carData._id === _id);
    setCurrentCar(selectedCar);
  };

  // close selected item
  const selectedCloseHandler = () => {
    setCurrentCar(undefined);
  };

  const setLabelHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const inputValue = event.target.value;
    setInputLabel(inputValue);
  };

  // control user are cropping or not
  const startCroppingHandler = () => {
    setIsAllow((prevState) => (prevState = !prevState));

    if (!imgRef.current) return;

    if (!isAllow) {
      imgRef.current.style.cursor = 'crosshair';
    } else {
      imgRef.current.style.cursor = 'unset';
    }
  };

  // store final coordinate
  const setCoorHandler = (coordinate: number[]) => {
    setFinalCoordinate(coordinate);
  };

  // send brand and coordinate via api
  const submitHandler = () => {
    if (inputLabel.trim().length === 0) {
      alert('please put the car brand');
      return;
    }
    if (finalCoordinate.length === 0) {
      alert('please cropping the car tag');
      return;
    }

    console.log(finalCoordinate);
    console.log(inputLabel);
    alert('submit successfully');
  };

  // for setting canvas dimension
  useEffect(() => {
    if (!imgRef.current) return;

    setDimention({
      width: imgRef.current.offsetWidth,
      height: imgRef.current.offsetHeight,
    });

    imgRef.current.style.backgroundImage = `url(${currentCar?.url})`;
  }, [currentCar]);

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
          <div className={styles.selected}>
            <div
              className={styles.selected__backdrop}
              onClick={selectedCloseHandler}
            ></div>
            <div className={styles.selected__container}>
              <div className={styles.selected__image} ref={imgRef}>
                <Canvas
                  props={{ width: dimension.width, height: dimension.height }}
                  isAllow={isAllow}
                  passCoor={setCoorHandler}
                />
              </div>
              <div className={styles.selected__tools}>
                <button
                  className={styles.btn_close}
                  onClick={selectedCloseHandler}
                >
                  <img src='/images/close.png' alt='X' />
                </button>
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
                  autoComplete='off'
                  onChange={setLabelHandler}
                  value={inputLabel}
                  required
                  list='brand'
                />
                <datalist id='brand'>
                  <option value='Audi' />
                  <option value='BMW' />
                  <option value='Chevrolet' />
                  <option value='Fiat' />
                  <option value='Fiat' />
                  <option value='Honda' />
                  <option value='Hyundai' />
                  <option value='Tesla' />
                  <option value='Toyota' />
                  <option value='Volvo' />
                </datalist>
                <button
                  className={styles.btn_main}
                  onClick={startCroppingHandler}
                >
                  {!isAllow ? (
                    <div>
                      <img src='/images/crop.png' alt='crop' />
                      <p>Crop Car Tag</p>
                    </div>
                  ) : (
                    <div>
                      <img src='/images/crop.png' alt='crop' />
                      <p>Finished</p>
                    </div>
                  )}
                </button>
                <button className={styles.btn_submit} onClick={submitHandler}>
                  Submit
                </button>
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
