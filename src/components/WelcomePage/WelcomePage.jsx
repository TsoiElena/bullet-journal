import React from 'react';
import styles from './WelcomePage.module.css'

const WelcomePage = () => {
    return (
        <div className={styles.preveu}>
            <h1 className={styles.heading}>Bullet journal! </h1>
            <div className={styles.text}>
                    <span className={styles.textHead}>
                        Привет!
                    </span> <br/>
                <span className={styles.podtext}>
                            Ты попал на страницу BUJO. <br/>
                        Здесь ты сможешь планировать свой день и не только день, но и целый год! <br/>
                        Cтавить себе цели и стремиться к лучшей версии себя. <br/>
                        Сможешь планировать и контролировать свои финансы на месяц. <br/>
                        Планировать фильмы и мультфильмы, которые хочешь посмотреть <br/>
                        и чтобы не забыть их название записывать их у себя, <br/>
                        а так же отмечать понравились они тебе или нет, та же схема с книгами. <br/>
                        Сможешь увидеть каких результатов ты добмлся за месяц и год.
                        </span> <br/>
                <span className={styles.textHead}>
                        Что ждет тебя в этом приложении после регистрации?
                    </span> <br/>
                <ul>Ты получишь доступ:</ul>
                <span className={styles.podtext}>
                        <li>к календарю, где сможешь написать цели разных сфер своей жихни на год;</li>
                    <li>к возможности планирования и ведения своих финансов <br/>
                        (это поможет тебе не тратить много денег, {/*<br/>*/}
                        понять сколько ты зарабатываешь и сколько можешь накопить)</li>
                    </span> <br/>
                <span className={styles.textHead}>
                        И многе другое!!!
                    </span> <br/>
                <span className={styles.podtext}>
                        Скорее регистрируйся на сайте и управляй своей жизнь сам! <br/>
                    Это ведь так здорово, когда ты не течешь по течению, а знаешь чего хочешь!
                    </span>
            </div>
        </div>
    );
}

export default WelcomePage;