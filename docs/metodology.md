# 5 Description of the methods

This standard covers the calculation of the design heat load of single rooms, building entities and buildings. It contains a standard method and two simplified methods. Note that, while the standard method is a versatile approach, the simplified methods are restricted to certain cases of application and boundary conditions.

### Table 4 — Calculation methods, overview

<table><thead><tr><th></th><th>Method</th><th>Application</th><th>Restrictions within the overall scope of this standard</th></tr></thead><tbody><tr><td>1</td><td>Standard method - Heat load of rooms, building entities and buildings (6)</td><td>— Versatile approach for any consideration on heat losses/load in accordance with Clause 1 (Scope) — Typically, dimensioning of components of heating systems in — new buildings — extensive reconstruction measures</td><td>-</td></tr><tr><td>2</td><td>Simplified method for the calculation of the design heat load of a heated space (single rooms) (7) $^a$</td><td>Determination of room heat load prior to measures concerning the heat emission system in single rooms — exchange of heat emission (e.g. radiators) — hydraulic balancing</td><td rowspan="2">a) Only applicable to rooms in: 1) residential buildings or buildings of similar use 2) existing buildings / building stock 3) buildings with natural ventilation</td></tr>
<tr><td>3</td><td>Simplified method for the calculation of the building design heat load (8) $^a$</td><td>Determination of building heat load prior to measures concerning the heat generation, e.g. — exchange of the heat generator</td></tr></tbody></table>

$^a$ The simplified methods (7, 8) are not suited to substitute the standard method (6) in case of extensive measures concerning heat generation AND emission.

# 8 Simplified method for the calculation of the building design heat load

## 8.1 Output data

This method covers a steady-state calculation of the heat load for a building and is restricted to application cases and boundary conditions stated in Clause 5 “Description of the methods”.

### Table 11 — Output data

| Description | Symbol | Unit | Intended use | Intended destination module |
| --- | --- | --- | --- | --- |
| Building design heat load | $\Phi_{\text{HL,build}}$ | W | — Dimensioning of components of the heat generation system (e.g. boiler) | - |

## 8.2 Input data

The following input data are required and shall be obtained from the sources named. In case of multiple sources for one item, all sources are arranged in order of priority from highest to lowest.

### Table 12 — Input data

| Symbol | Description | Unit | Source |
|---|---|---|---|
| $A_k$ | Area of the building element ($k$) | $\text{m}^2$ | — Building data / Measurement |
| $U_k$ | Thermal transmittance of the building element ($k$) | $\text{W}/(\text{m}^2\cdot\text{K})$ | — Building data — National annex to this standard in accordance with Subclause A.4.3 — Subclause B.4.3 |
| $\Delta U_{\text{TB}}$ | Blanket additional thermal transmittance for thermal bridges | $\text{W}/(\text{m}^2\cdot\text{K})$ | — National annex to this standard in accordance with Subclause A.3.2; alternatively A.2.1 — Subclause B.3.2; alternatively B.2.1 |
| $V_{\text{Build}}$ | Internal volume of the considered heated building | $\text{m}^3$ | — Building data / Measurement |
| $n_{\text{Build}}$ | Air change rate of the considered heated building | $\text{h}^{-1}$ | — Building data — National annex to this standard in accordance with Subclause A.3.4 — Subclause B.3.4 |
| $\theta_{\text{int,build}}$ | Internal design temperature of the considered heated building | °C | — Building data, design — National annex to this standard in accordance with Subclause A.4.2 — Subclause B.4.2 |
| $\theta_{\text{e}}$ | External design temperature | °C | — National annex to this standard in accordance with Subclause A.4.1$^a$ |
| $f_x$ | Temperature correction factor | - | — National annex to this standard in accordance with Subclause A.3.3, alternatively A.2.4 ($\rightarrow f_{\text{i}}$) — Subclause B.3.3, alternatively B.2.4 ($\rightarrow f_{\text{i}}$) |

$^a$ Within this simplified approach, $\theta_{\text{e}} = \theta_{\text{e, Ref.}}$

## 8.3 Calculation procedure

### 8.3.1 Building design heat load

The design heat loss of a heated building is determined in accordance with Formula (54). Within this simplified approach, no additional power for heating-up is taken into account. Therefore, the design heat loss is the same as the design heat load:

$$\Phi_{\text{HL,build}} = \Phi_{\text{T,build}} + \Phi_{\text{V,build}} \qquad (54)$$

where

|  |  |  |
| --- | --- | --- |
| $\Phi_{\text{HL,build}}$ | building design heat loss | W |
| $\Phi_{\text{T,build}}$ | building design transmission heat loss in accordance with Formula (55) | W |
| $\Phi_{\text{V,build}}$ | building design ventilation heat loss in accordance with Formula (56) | W |

---

### 8.3.2 Building design transmission heat loss

The design transmission heat loss of a building is determined in accordance with Formula (55).

Within this simplified approach, only outer surfaces of the thermal envelope of the considered building shall be taken into account – i.e. building elements adjacent to:

— external air ($\text{e}$);

— unheated spaces ($\text{u}$) and;

— ground ($\text{g}$).

$$\Phi_{\text{T,build}} = \sum_{k} \Phi_{\text{T,k}} = \sum_{k} \left( A_k \cdot (U_k + \Delta U_{\text{TB}}) \cdot f_{\text{x,k}} \right) \cdot (\theta_{\text{int,build}} - \theta_{\text{e}}) \qquad (55)$$

where

|  |  |  |
| --- | --- | --- |
| $\Phi_{\text{T,build}}$ | building design transmission heat loss | W |
| $\Phi_{\text{T,k}}$ | transmission heat loss of the building element ($k$) | W |
| $A_k$ | area of the building element ($k$) | $\text{m}^2$ |
| $U_k$ | thermal transmittance of the building element ($k$) | $\text{W}/(\text{m}^2\cdot\text{K})$ |
| $\Delta U_{\text{TB}}$ | blanket additional thermal transmittance for thermal bridges; if thermal bridges are taken into account by other means (e.g. detailed consideration after Annex C) in compliance with national regulations, $\Delta U_{\text{TB}} = 0$ for the respective building parts | $\text{W}/(\text{m}^2\cdot\text{K})$ |
| $f_{\text{x,k}}$ | temperature adjustment factor | - |
| $\theta_{\text{int,build}}$ | internal design temperature of the considered heated building | °C |
| $\theta_{\text{e}}$ | external design temperature | °C |

---

### 8.3.3 Design ventilation heat loss of a building

The building design ventilation heat loss is determined in accordance with Formula (56):

$$\Phi_{\text{V,build}} = V_{\text{Build}} \cdot n_{\text{Build}} \cdot \rho_{\text{a}} \cdot c_{\text{p,a}} \cdot (\theta_{\text{int,build}} - \theta_{\text{e}}) \qquad (56)$$

where

|  |  |  |
|---|---|---|
| $\Phi_{\text{V,build}}$ | building design ventilation heat loss | W |
| $V_{\text{Build}}$ | internal volume (air volume) of the building | $\text{m}^3$ |
| $n_{\text{Build}}$ | air change rate of the building | $\text{h}^{-1}$ |
| $\rho_{\text{a}} \cdot c_{\text{p,a}}$ | matter constant of air; In this simplified approach, $\rho_{\text{a}}$ and $c_{\text{p,a}}$ are fixed to $\rho_{\text{a}} \cdot c_{\text{p,a}} = 0,34$. | $\text{Wh}/(\text{m}^3\cdot\text{K})$ |
| $\theta_{\text{int,build}}$ | internal design temperature of the considered heated building | °C |
| $\theta_{\text{e}}$ | external design temperature | °C |
