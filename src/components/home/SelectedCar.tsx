import { useState, useRef } from 'react';

import styles from './HomePage.module.scss';
import Canvas from './Canvas';
import Datalist from './Datalist';

import { CarData, SubmitCarData } from './HomPage';

interface SelectedCarProps {
  currentCar: CarData;
  resetCurrentCar: (resetCar: undefined) => void;
  onSubmit: (finalCarData: SubmitCarData) => void;
}

const SelectedCar: React.FC<SelectedCarProps> = ({
  currentCar,
  resetCurrentCar,
  onSubmit,
}) => {
  // brand input storage
  const [inputLabel, setInputLabel] = useState('');
  // Coordinate input storage
  const [finalCoordinate, setFinalCoordinate] = useState<number[]>([]);
  // to get image width and heigh ref
  const imgRef = useRef<HTMLImageElement | null>(null);
  // for cropping button
  const [isAllow, setIsAllow] = useState(false);

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

  // close selected item
  const selectedCloseHandler = () => {
    resetCurrentCar(undefined);
    setIsAllow(false);
  };

  const onSubmitHandler = () => {
    if (inputLabel.trim().length === 0) {
      alert('please put the car brand');
      return;
    }
    if (finalCoordinate.length === 0) {
      alert('please cropping the car tag plate');
      return;
    }

    const finalCarData: SubmitCarData = {
      _id: currentCar._id,
      image_name: currentCar.image_name,
      image_label: inputLabel,
      plate: { coor: finalCoordinate },
    };

    onSubmit(finalCarData);
    setInputLabel('');
    setIsAllow(false);
  };

  return (
    <div className={styles.selected}>
      <div
        className={styles.selected__backdrop}
        onClick={selectedCloseHandler}
      ></div>
      <div className={styles.selected__container}>
        <div className={styles.selected__image}>
          <div className={styles.selected__image_container} ref={imgRef}>
            <img src={currentCar.url} alt='selected car' />
            <Canvas
              props={{
                className: styles.selected__image_canvas,
              }}
              isAllow={isAllow}
              passCoor={setCoorHandler}
            />
          </div>
        </div>
        <div className={styles.selected__tools}>
          <button className={styles.btn_close} onClick={selectedCloseHandler}>
            <img src='/images/close.png' alt='X' />
          </button>
          <h2 className={styles.tools__heading}>{currentCar.image_name}</h2>
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
          <Datalist />
          <button className={styles.btn_main} onClick={startCroppingHandler}>
            {!isAllow ? (
              <div>
                <img src='/images/crop.png' alt='crop' />
                <p>Crop Car Tag</p>
              </div>
            ) : (
              <div>
                <img src='/images/crop.png' alt='crop' />
                <p>Cropping</p>
              </div>
            )}
          </button>
          <button className={styles.btn_submit} onClick={onSubmitHandler}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedCar;
