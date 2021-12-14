import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import isNanoAddress from 'nano-address-validator';
import { FaCheck, FaExclamationCircle } from 'react-icons/fa';


const form = css`

width: 680px;
max-width: 96%;
margin: 20px auto;

.input-group {

    position: relative;

    .icon-ok, .icon-error {
        font-size: 18px;
        width: 20px;
        height: 18px;
        position: absolute;
        top: 50%;
        left: 6px;
        z-index: 10;
        transform: translate(0, -50%);
        color: #428fde;
        text-align: center;
        display: none;
    }

    .icon-error {
        color: #ea5365;
    }
      
      &.ok .icon-ok, &.error .icon-error{
        display: block;
      }



input {
    margin: 0;
    border: 1px solid var(--primary-border);
    border-radius: 8px;
    padding: 0.65rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
    box-sizing: border-box;
    width: 100%;
    min-width: min(65ch, 100% - 1rem);
    padding-left: 32px;

    &.invalid {
      color: var(--red);
    }

    &::placeholder {
      color: var(--primary);
      font-family: var(--font);
    }

    &:focus, &:hover {
      outline: none;
      border-color: #66afe9;
      outline: 0;
    }
  }

  &.error input:focus {
    border-color: rgba(284, 83, 101, .7);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(284, 83, 101, 0.6);
  }

}
.checkboxContainer {
    margin: 20px 0;
    min-height: 85px;
}
`;

interface Form {
    address: string;
}

function isHex(str: string): boolean {
    return /^[A-F0-9]+$/i.test(str)
}

export const Nanodrop: React.FC = (props) => {

    const [theme, setTheme] = useState("light")

    function awaitNanoDrop(checkRendered = false) {
        return new Promise(async function (resolve, reject) {
            for (let i = 0; i < 600; i++) {
                if (typeof (nanodrop) == "object" && nanodrop.loaded) {
                    if (checkRendered) {
                        if (nanodrop.rendered) return resolve(true)
                    } else {
                        return resolve(true)
                    }
                }
                await sleep(100)
            }
            reject("timeout")
        })
    }

    useEffect(() => {
        awaitNanoDrop()
            .then(() => {
                nanodrop.render("nanodrop-checkbox")
                    .then((res) => {
                        console.log("nanodrop checkbox loaded")
                    })
                    .catch(err => alert(err))
            })
            .catch(err => alert(err))


    }, [])


    useEffect(() => {
        awaitNanoDrop(true).then(() => {
            if (props.theme != theme) {
                nanodrop.changeTheme(props.theme)
                setTheme(props.theme)
            }
        })
    }, [props.theme])

    const [nanoAddress, setNanoAddress] = useState('');

    const validate = (value) => isNanoAddress(value, ['nano', 'xrb']) || (isHex(value) && value.length === 64);

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


    function handleChange(e) {
        const val = e.target.value

        if (val == "") {
            e.target.parentNode.classList.remove("error")
            e.target.parentNode.classList.remove("ok")
            awaitNanoDrop(true).then(() => nanodrop.setAccount(null))
        } else {

            if (validate(val)) {
                setNanoAddress(val)
                e.target.parentNode.classList.remove("error")
                e.target.parentNode.classList.add("ok")
                awaitNanoDrop(true).then(() => nanodrop.setAccount(val))
            } else {
                e.target.parentNode.classList.remove("ok")
                e.target.parentNode.classList.add("error")
                awaitNanoDrop(true).then(() => nanodrop.setAccount(null))
            }
        }
    }

    return <div className={form}>
        <div className={"input-group"}>
            <input
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className={[false ? 'invalid' : '',].join(' ')}
                type="text"
                id="addNanoAddress"
                onChange={e => handleChange(e)}
                placeholder="Enter your Nano wallet address here"
            />
            <i className="icon-ok"><FaCheck /></i>
            <i className="icon-error"><FaExclamationCircle /></i>

        </div>
        <div className="checkboxContainer">
            <div id="nanodrop-checkbox"></div>
        </div>
    </div>
};
