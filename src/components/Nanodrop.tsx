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

function isHex(str: string): boolean {
    return /^[A-F0-9]+$/i.test(str)
}
interface INanoDrop {
    theme?: 'light' | 'dark'
}

export const Nanodrop = ({ theme = 'light' }: INanoDrop) => {

    const [nanodrop, setNanoDrop] = useState<any>(null)
    const [nanoAddress, setNanoAddress] = useState(null);
    const [disableInput, setDisableInput] = useState<boolean>(true)

    useEffect(() => {
        const script = document.createElement("script");
        script.src = 'https://drop.nanocafe.cc/api/api.js?render=explicit'; // new line
        script.onload = function () {
            console.log("nanodrop script loaded")
        };
        document.body.appendChild(script);
    }, [])

    useEffect(() => {
        window.addEventListener("nanodropOnload", function (evt: any) {
            setNanoDrop(evt.detail.nanodrop)
            setDisableInput(false)
            console.log("nanodrop loaded", evt.detail.nanodrop)
        }, false);
    }, [])

    useEffect(() => {
        if (!nanodrop) return
        nanodrop.render("nanodrop-checkbox")
            .then((res: any) => {
                if (nanoAddress) nanodrop.setAccount(nanoAddress)
                console.log("nanodrop checkbox rendered")
            })
            .catch((err: any) => alert(err))
    }, [nanodrop])


    useEffect(() => {
        if (theme != theme && nanodrop) {
            nanodrop.changeTheme(theme)
        }
    }, [theme, nanodrop])

    const validate = (value: string) => isNanoAddress(value, ['nano', 'xrb']) || (isHex(value) && value.length === 64);

    function handleChange(e: any) {
        const val = e.target.value
        if (val == "") {
            e.target.parentNode.classList.remove("error")
            e.target.parentNode.classList.remove("ok")
            nanodrop.setAccount(null)
        } else {
            if (validate(val)) {
                setNanoAddress(val)
                e.target.parentNode.classList.remove("error")
                e.target.parentNode.classList.add("ok")
                nanodrop.setAccount(val)
            } else {
                e.target.parentNode.classList.remove("ok")
                e.target.parentNode.classList.add("error")
                nanodrop.setAccount(null)
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
                onChange={handleChange}
                onFocus={handleChange}
                onBlur={handleChange}
                onPaste={handleChange}
                placeholder="Enter your Nano wallet address here"
                disabled={disableInput}
            />
            <i className="icon-ok"><FaCheck /></i>
            <i className="icon-error"><FaExclamationCircle /></i>

        </div>
        <div className="checkboxContainer">
            <div id="nanodrop-checkbox"></div>
        </div>
    </div>
};
