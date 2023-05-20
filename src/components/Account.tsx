import React, { useMemo } from 'react';
import { useAliases } from '../api';
import Link from 'next/link';

interface Props {
  account?: string;
}

export const Account: React.FC<Props> = ({ account }) => {
  const aliases = useAliases();

  const alias = useMemo(() => {
    return aliases.data?.find((record) => record.account === account)?.alias;
  }, [ account, aliases.data ]);

  return <div>
    <Link href={`/${account}`}>{ account }</Link>
    { alias && <>
      <br/>
      { alias }
    </> }
  </div>;
};