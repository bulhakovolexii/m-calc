Here is the precise formatting of the provided documents. The text has been formatted into Markdown, and the complex table containing merged cells (rowspan/colspan) has been built using clean HTML as requested.

---

## B.3.3 Temperature correction factor $\text{f}_\text{x}$

Temperature adjustment factors for the calculation of transmission heat loss in accordance with the simplified methods shall be defined nationally. In the absence of national data, the following default values may be used. Alternatively, temperature adjustment terms $\text{f}_\text{l}$ after B.2.4 may be used.

### Table B.11 — Temperature correction factor

| Building elements adjacent to | Correction factor $\text{f}_\text{x}$ | Index |
| --- | --- | --- |
| external air (e) | 1,0 | ie |
| unheated spaces or another building entity (u) | 0,5 | iu |
| ground (g) | 0,3 | ig |
| heated space (j) | 0,3 | ij |

---

## B.2.4 Temperature adjustment for heat loss to unheated spaces

In case of heat loss to unheated spaces and ceiling heights < 4 m, the temperature adjustment term $\text{f}_\text{l}$ may be taken from Table B.2 unless specified otherwise on a national basis.

### Table B.2 — Temperature adjustment term $\text{f}_\text{l}$, default values

<table border="1">
  <thead>
    <tr>
      <th colspan="3">Unheated space</th>
      <th>f<sub>i</sub></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="4">Room or group of adjoining rooms/spaces</td>
      <td colspan="2">1 external wall</td>
      <td>0,4</td>
    </tr>
    <tr>
      <td rowspan="2">2 external walls</td>
      <td>without external doors</td>
      <td>0,5</td>
    </tr>
    <tr>
      <td>with external doors</td>
      <td>0,6</td>
    </tr>
    <tr>
      <td colspan="2">3 or more external walls; e.g. external (heated) staircase</td>
      <td>0,8</td>
    </tr>

    <tr>
      <td rowspan="2">Basement <sup>a</sup></td>
      <td colspan="2">without external doors/windows</td>
      <td>0,5</td>
    </tr>
    <tr>
      <td colspan="2">with external doors/windows</td>
      <td>0,8</td>
    </tr>

    <tr>
      <td rowspan="3">Roof space</td>
      <td colspan="2">high ventilation rate of the roof space; e.g. roofs with discontinuous covers (tiles, etc.) and without a sealing sarking layer</td>
      <td>1,0</td>
    </tr>
    <tr>
      <td colspan="2">other non-insulated roofs</td>
      <td>0,9</td>
    </tr>
    <tr>
      <td colspan="2">insulated roofs</td>
      <td>0,7</td>
    </tr>

    <tr>
      <td rowspan="2">Circulation area</td>
      <td colspan="2">internal space (no external walls) with low ventilation (&le;0,5 h<sup>-1</sup>)</td>
      <td>0,0</td>
    </tr>
    <tr>
      <td colspan="2">
        freely ventilated ( (A<sub>openings</sub> / V) &gt; 0.005 · [m<sup>2</sup> / m<sup>3</sup>] )
      </td>
      <td>1,0</td>
    </tr>

    <tr>
      <td>Floor</td>
      <td colspan="2">suspended (floor above crawl space)</td>
      <td>0,8</td>
    </tr>

    <tr>
      <td colspan="4">
        <sup>a</sup> A room can be considered as a basement if more than 70 % of the external wall area is in contact with the ground.
      </td>
    </tr>
  </tbody>
</table>

> a A room can be considered as a basement if more than 70 % of the external wall area is in contact with the ground.

---

## B.2.3 Heat loss through the ground

Default values for the correction factors $\text{f}_{\theta\text{ann}}$ and $\text{f}_{\text{GW}}$ are:

$$\text{f}_{\theta\text{ann}} = 1,45;$$

$$\text{f}_{\text{GW}} = 1,00 \text{ if the distance between assumed water table and floor slab is } > 1 \text{ m};$$

$$\text{f}_{\text{GW}} = 1,15 \text{ if the distance between assumed water table and floor slab is } \le 1 \text{ m}.$$

A simplified method to determine the equivalent thermal transmittance $\text{U}_{\text{equiv},k}$ of a building ($k$) element in contact with the ground shall be defined nationally. Where no national data are available, informative Annex E shall be applied.
