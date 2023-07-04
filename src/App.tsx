import React from 'react';
import './App.css';

const BANDS = [
  "135k",
  "475k",
  "1.9M",
  "3.5M",
  "3.8M",
  "7M",
  "10M",
  "14M",
  "18M",
  "21M",
  "24M",
  "28M",
  "50M",
  "144M",
  "430M",
  "1200M",
  "2400M",
  "5600M",
  "10G",
] as const;
type BandName = typeof BANDS[number];

const MODES = ["CW", "PH", "FM", "ALL"];

interface BandInfo {
  ranges: string;
  note: string;
}

const initial_bands: { [key in BandName]: BandInfo } = {
  "135k": {ranges: "", note: ""},
  "475k": {ranges: "", note: ""},
  "1.9M": {
    ranges: `
      CW: 1.801 - 1.820
      PH: 1.850 - 1.875
    `,
    note: `
      FT8 : 1.909
    `,
  },
  "3.5M": {
    ranges: `
      CW: 3.510 - 3.530
      PH: 3.535 - 3.570
    `,
    note: `
      非常: 3.535
      FT8 : 3.531
      FT8 : 3.573
    `,
  },
  "3.8M": {ranges: "", note: ""},
  "7M": {
    ranges: `
      CW: 7.010 - 7.040
      PH: 7.060 - 7.140
    `,
    note: `
      非常: 7.050
      FT8 : 7.041
      FT8 : 7.074
    `,
  },
  "10M": {ranges: "", note: ""},
  "14M": {
    ranges: `
      CW: 14.050 - 14.080
      PH: 14.250 - 14.300
    `,
    note: `
      ビーコン: 14.100
      非常: 14.300
      FT8 : 14.074
    `,
  },
  "18M": {
    ranges: `
    `,
    note: `
      ビーコン: 18.110
      非常: 18.160
    `,
  },
  "21M": {
    ranges: `
      CW: 21.050 - 21.080
      PH: 21.350 - 21.450
    `,
    note: `
      ビーコン: 21.150
      非常: 21.360
      FT8 : 21.074
    `,
  },
  "24M": {
    ranges: `
    `,
    note: `
      ビーコン: 24.930
    `,
  },
  "28M": {
    ranges: `
      CW: 28.050 - 28.080
      PH: 28.600 - 28.850
      FM: 29.200 - 29.300
    `,
    note: `
      非常: 28.200
      FT8 : 28.074
    `,
  },
  "50M": {
    ranges: `
      CW: 50.050 - 50.090
      PH: 50.350 - 51.000
      FM: 51.000 - 52.000
    `,
    note: `
      非常: 51.000
      呼出: 51.300
      FT8 : 50.313
      FT8 : 50.323
    `,
  },
  "144M": {
    ranges: `
      CW: 144.050 - 144.090
      PH: 144.250 - 144.500
      FM: 144.750 - 145.600
    `,
    note: `
      呼出: 145.000
      D呼出: 145.300
      D呼出: 145.500
      FT8 : 144.460
    `,
  },
  "430M": {
    ranges: `
      CW: 430.050 - 430.090
      PH: 430.250 - 430.700
      FM: 432.100 - 434.000
    `,
    note: `
      呼出: 433.000
      非常: 433.300
      非常: 433.500
      FT8 : 430.510
    `,
  },
  "1200M": {
    ranges: `
      CW: 1294.000 - 1294.500
      FM: 1294.900 - 1295.800
    `,
    note: `
      非常: 1294.000
      呼出: 1295.000
    `,
  },
  "2400M": {
    ranges: `
      ALL: 2427.000 - 2450.000
    `,
    note: `
    `,
  },
  "5600M": {
    ranges: `
      ALL: 5757.000 - 5760.000
    `,
    note: `
      呼出: 5760.000
    `,
  },
  "10G": {
    ranges: `
      ALL: 10.240 - 10.242
    `,
    note: `
      呼出: 10.240
    `,
  },
};

type BandConfig = {
  [key in BandName]?: BandInfo & {
    enabled: boolean,
    nr?: string,
  }
}

function trim(s: string) {
  return s.trim().replace(/^\s+/mg, '');
}

function App() {
  const [myCall, setMyCall] = React.useState("JA1ZLO");
  const [myNr, setMyNr] = React.useState("10M");
  const [bands, setBands] = React.useState<BandConfig>(() => {
    const a = Object.entries(initial_bands).map(([band, bandinfo]) => {
      bandinfo.ranges = trim(bandinfo.ranges);
      bandinfo.note = trim(bandinfo.note);
      return [band, {...bandinfo, enabled: true}];
    });
    return Object.fromEntries(a);
  });

  const [configJson, setConfigJson] = React.useState(() => JSON.stringify({myCall, myNr, bands}, null, 2));
  React.useEffect(() => {
    setConfigJson(JSON.stringify({myCall, myNr, bands}));
  }, [myCall, myNr, bands]);

  return (
    <div className="App">
      <h1>コンテスト紙メーカー</h1>
      <section id="config">
        <p><a href="https://github.com/ibuki2003/contest_paper/">GitHub: github.com/ibuki2003/contest_paper</a></p>
        <p><input type="text" placeholder="JA1ZLO/1" value={myCall} onChange={(e) => setMyCall(e.target.value)} /></p>
        <p><input type="text" placeholder="10 P" value={myNr} onChange={(e) => setMyNr(e.target.value)} /></p>
        <textarea value={configJson} onChange={(e) => setConfigJson(e.target.value)} />
        <p><button onClick={() => {
          try {
            const config = JSON.parse(configJson);
            setMyCall(config.myCall);
            setMyNr(config.myNr);
            // setBands(config.bands);
            for (const band of BANDS) {
              bands[band] = config.bands[band];
            }
            setBands({...bands});
          } catch (e) {
            alert(e);
          }
        }}>Load</button></p>

        <p><button onClick={() => {
          window.print();
        }}>Print</button></p>
      </section>

      <section id="pages">
      {Object.entries(bands).map(([band, bandinfo], i) => (
        <div className={`page ${bandinfo.enabled?"":"hidden"}`} key={band}>
          <div className="container">
            <h2>
              <input
                type="checkbox"
                className="band-enable-check"
                id={`band_${band}_enable`}
                checked={bandinfo.enabled}
                onChange={(e) => {
                  setBands({...bands, [band]: {...bandinfo, enabled: e.target.checked}});
                }}
                />
              <label htmlFor={`band_${band}_enable`}>{band}</label>
            </h2>
            <div className="row">
              <div className="ranges">
                <textarea
                  value={bandinfo.ranges}
                  onChange={e => setBands({...bands, [band]: {...bandinfo, ranges: e.target.value}})}
                  />
                <div className="preview">
                  {bandinfo.ranges.split('\n').map((key, i) => (
                    <p key={i}>{key}</p>
                  ))}
                </div>
              </div>
              <div className="note">
                <textarea
                  value={bandinfo.note}
                  onChange={e => setBands({...bands, [band]: {...bandinfo, note: e.target.value}})}
                  />
                <div className="preview">
                  {bandinfo.note.split('\n').map((note, i) => <p key={i}>{note}</p>)}
                </div>
              </div>
            </div>
            <p className="footer">
              {myCall} 59(9)

              <span className="preview">{bandinfo.nr || myNr}</span>
              <input type="text" value={bandinfo.nr} placeholder={myNr} onChange={(e) => setBands({...bands, [band]: {...bandinfo, nr: e.target.value}})} />
            </p>
          </div>
        </div>
      ))}
      </section>
    </div>
  );
}

export default App;
