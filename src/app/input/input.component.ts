import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface SelectionOption {
    displayText: string;
    trailingText: string;
    sourceObj: any;
}

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {
    resultText: string = '';

    @Input()
    inputJson: any;
    @Output()
    routeReached = new EventEmitter<string>();

    selectionOptions: SelectionOption[];
    selectionsOpen: boolean = false;

    complete: boolean = false;

    constructor() {}

    ngOnInit() {
        this.setInitialValue();
    }

    private setInitialValue() {
        this.selectionOptions = [
            {
                sourceObj: this.inputJson,
                displayText: 'all',
                trailingText: 'all'
            }
        ];
    }

    selectionsClicked(event: MouseEvent) {
        this.selectionsOpen = true;
        event.stopPropagation();
    }

    hideSelectionOptions() {
        this.selectionsOpen = false;
    }

    selectOption(option: SelectionOption, event: MouseEvent) {
        event.stopPropagation();
        this.resultText = option.trailingText;

        if (this.isPrimitive(option.sourceObj)) {
            this.selectionsOpen = false;
            this.complete = true;
            this.routeReached.emit(option.trailingText);
            this.setInitialValue();
            return;
        }

        this.complete = false;
        this.selectionsOpen = true;
        this.selectionOptions = [];
        if (option.sourceObj instanceof Array) {
            this.extractArrayItems(option.sourceObj, option);
        } else {
            this.createTraverseOptions(option);
        }
    }

    private createTraverseOptions(option: SelectionOption, namePrefix: string = '') {
        for (const name in option.sourceObj) {
            if (option.sourceObj.hasOwnProperty(name)) {
                if (this.isTraversable(option.sourceObj[name])) {
                    this.selectionOptions.push({
                        trailingText: option.trailingText + '.' + name,
                        sourceObj: option.sourceObj[name],
                        displayText: namePrefix + '.' + name
                    });
                }
            }
        }
    }

    extractArrayItems(item: Array<any>, parentOption: SelectionOption) {
        item.map((value, index) => {
            this.createTraverseOptions(
                {
                    displayText: parentOption.displayText + '[' + index + ']',
                    sourceObj: value,
                    trailingText: parentOption.trailingText + '[' + index + ']'
                },
                `Index ${index}: `
            );
        });
    }

    selectionsDblClick(event: MouseEvent) {
        event.preventDefault();
    }

    isTraversable(item: any): boolean {
        if (item === undefined || item === null) {
            return false;
        }

        if (typeof item === 'function') {
            return false;
        }

        if (item instanceof RegExp) {
            return false;
        }

        if (item instanceof Array) {
            return true;
        }

        if (item instanceof Object) {
            return true;
        }

        if (!this.isPrimitive(item)) {
            return false;
        }

        return true;
    }

    isPrimitive(item) {
        if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
            return true;
        }
    }
}
