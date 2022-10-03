import { ChangeDetectionStrategy, Component, ContentChild, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation } from "@angular/core";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class CardComponent {

    @Input()
    title!: string;

    @Input()
    customTitle!: TemplateRef<ElementRef>;

    @Input()
    content!: string;

    @Input()
    customContent!: TemplateRef<ElementRef>;

    @Input()
    isEditable!: boolean;

    @Output()
    onDelete = new EventEmitter();

    @Output()
    onEdit = new EventEmitter();

    faPen = faPen;
    faTrash = faTrash;

    isCollapsed = true;

    toggle() {
        this.isCollapsed = !this.isCollapsed;
    }

}