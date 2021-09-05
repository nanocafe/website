import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAliases } from '../api';

interface Props {
  account?: string;
}

export const Account: React.FC<Props> = ({ account }) => {
  const aliases = useAliases();

  const alias = useMemo(() => {
    return aliases.data?.find((record) => record.account === account)?.alias;
  }, [ account, aliases.data ]);

  return <div>
    <Link to={`/${account}`}>{ account }</Link>
    { alias && <>
      <br/>
      { alias }
    </> }
  </div>;
};