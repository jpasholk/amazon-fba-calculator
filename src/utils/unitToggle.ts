export interface UnitToggleState {
  isImperialUnits: boolean;
  unitSuffix: {
    length: string;
    weight: string;
  };
}

export interface UnitToggleElements {
  unitDisplay: HTMLElement;
  lengthLabel: HTMLLabelElement;
  widthLabel: HTMLLabelElement;
  heightLabel: HTMLLabelElement;
  weightLabel: HTMLLabelElement;
  lengthInput: HTMLInputElement;
  widthInput: HTMLInputElement;
  heightInput: HTMLInputElement;
  weightInput: HTMLInputElement;
}

export function createUnitToggleHandler(elements: UnitToggleElements) {
  let isImperialUnits = false;

  function updateUnitDisplay() {
    if (isImperialUnits) {
      elements.unitDisplay.textContent = 'Currently: Imperial (inches/lbs)';
      elements.lengthLabel.textContent = 'Length (inches)';
      elements.widthLabel.textContent = 'Width (inches)';
      elements.heightLabel.textContent = 'Height (inches)';
      elements.weightLabel.textContent = 'Weight (lbs)';
      
      elements.lengthInput.placeholder = '0';
      elements.widthInput.placeholder = '0';
      elements.heightInput.placeholder = '0';
      elements.weightInput.placeholder = '0';
    } else {
      elements.unitDisplay.textContent = 'Currently: Metric (cm/kg)';
      elements.lengthLabel.textContent = 'Length (cm)';
      elements.widthLabel.textContent = 'Width (cm)';
      elements.heightLabel.textContent = 'Height (cm)';
      elements.weightLabel.textContent = 'Weight (kg)';
      
      elements.lengthInput.placeholder = '0';
      elements.widthInput.placeholder = '0';
      elements.heightInput.placeholder = '0';
      elements.weightInput.placeholder = '0';
    }
  }

  function getUnitState(): UnitToggleState {
    return {
      isImperialUnits,
      unitSuffix: isImperialUnits ? 
        { length: '"', weight: ' lbs' } : 
        { length: ' cm', weight: ' kg' }
    };
  }

  function toggle() {
    isImperialUnits = !isImperialUnits;
    updateUnitDisplay();
    return getUnitState();
  }

  function setImperial(imperial: boolean) {
    isImperialUnits = imperial;
    updateUnitDisplay();
    return getUnitState();
  }

  // Initialize
  updateUnitDisplay();

  return {
    toggle,
    setImperial,
    getUnitState,
    updateDisplay: updateUnitDisplay
  };
}