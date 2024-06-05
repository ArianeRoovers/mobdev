import React from "react";
import style from "./Loading.module.css";

const Loading: React.FC = () => {
  return (
    <section className={style.wrapper}>
      <span className={style.loading__text}>Loading your favorite items!</span>
      <div className={style.loading__container}>
        <span className={style.circle}></span>
        <span className={style.circle}></span>
        <span className={style.circle}></span>
        <span className={style.circle}></span>
      </div>
    </section>
  );
};

export default Loading;
