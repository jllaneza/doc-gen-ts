/**
 * Sample Doc for button component
 */
@Component()
class SampleButtonComponent {
  /**
   * Specifies that a button should be disabled
   */
  @Input() disabled: boolean;
  /**
   * Specifies a name for the button
   */
  @Input() name: string;

  /**
   * fires on a mouse click on the button
   */
  @Output('click') onClick: Event;

  constructor() { }
}