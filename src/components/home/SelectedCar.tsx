import { useState, useRef } from 'react';

import styles from './HomePage.module.scss';
import Canvas from './Canvas';
import Datalist from './Datalist';

import { CarData, SubmitCarData } from './HomPage';

interface SelectedCarProps {
  currentCar: CarData;
  currentLabel: SubmitCarData | undefined;
  resetCurrentCar: (resetCar: undefined) => void;
  onSubmit: (finalCarData: SubmitCarData) => void;
}

const SelectedCar: React.FC<SelectedCarProps> = ({
  currentCar,
  currentLabel,
  resetCurrentCar,
  onSubmit,
}) => {
  // brand input storage
  const [inputLabel, setInputLabel] = useState(
    currentLabel?.image_label ? currentLabel.image_label : ''
  );
  // Coordinate input storage
  const [finalCoordinate, setFinalCoordinate] = useState<number[]>(
    currentLabel?.plate.coor ? currentLabel.plate.coor : []
  );
  // to get image width and heigh ref
  const imgRef = useRef<HTMLImageElement | null>(null);
  // current canvas dimension
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  // for cropping button
  const [isAllow, setIsAllow] = useState(false);

  const setLabelHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const inputValue = event.target.value;
    setInputLabel(inputValue);
  };

  // set canvas dimension as per img dimension
  const imgLoadHandler: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const src = event.currentTarget.src;
    if (src && imgRef.current) {
      const canvasDimension = {
        width: imgRef.current.offsetWidth,
        height: imgRef.current.offsetHeight,
      };
      setDimension(canvasDimension);
    }
  };

  // control user are cropping or not
  const startCroppingHandler = () => {
    setIsAllow((prevState) => (prevState = !prevState));
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

  // onsubmit pass data to parent component
  const onSubmitHandler = () => {
    if (
      inputLabel.trim().length === 0 &&
      currentLabel?.image_label.trim().length === 0
    ) {
      alert('please put the car brand');
      return;
    }

    if (finalCoordinate.length === 0 && currentLabel?.plate.coor.length === 0) {
      alert('please cropping the car tag plate');
      return;
    }

    // submit both value
    const finalCarData: SubmitCarData = {
      _id: currentCar._id,
      image_name: currentCar.image_name,
      image_label: inputLabel,
      plate: { coor: finalCoordinate },
    };

    // for submit only new coordinate
    if (
      currentLabel?.plate.coor[0] !== undefined &&
      currentLabel?.plate.coor.length !== 0 &&
      finalCoordinate[0] === undefined
    ) {
      finalCarData.plate.coor = currentLabel.plate.coor;
    }

    // for submit only label
    if (
      currentLabel?.image_label.trim().length !== 0 &&
      currentLabel?.image_label &&
      inputLabel.trim().length === 0
    ) {
      finalCarData.image_label = currentLabel.image_label;
    }

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
          <div
            className={
              !isAllow
                ? styles.selected__image_container
                : `${styles.selected__image_container} ${styles.cursor_crosshair}`
            }
          >
            <img
              src={currentCar.url}
              alt='selected car'
              ref={imgRef}
              onLoad={imgLoadHandler}
            />
            <Canvas
              props={{
                className: styles.selected__image_canvas,
                width: dimension.width,
                height: dimension.height,
              }}
              isAllow={isAllow}
              passCoor={setCoorHandler}
              lastCoor={currentLabel?.plate.coor}
            />
          </div>
        </div>
        <div className={styles.selected__tools}>
          <button className={styles.btn_close} onClick={selectedCloseHandler}>
            <img src='/images/close.png' alt='X' />
          </button>
          <h2 className={styles.tools__heading}>{currentCar.image_name}</h2>
          <label className={styles.tools__label} htmlFor={currentCar._id}>
            Brand &#x3A; {currentLabel?.image_label}
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
          {currentLabel?.plate && (
            <div>
              <h3>Last Coordinate</h3>
              <p>
                &#91;{' '}
                {`x = ${currentLabel.plate.coor[0]}, y = ${currentLabel.plate.coor[1]}, width = ${currentLabel.plate.coor[2]}, heigth = ${currentLabel.plate.coor[3]}`}{' '}
                &#93;
              </p>
            </div>
          )}
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
