
<template>
	  <div class="MatcDesignTokenMixin">
      <DesignTokenView v-show="hasDesignToken" :designtoken="currentDesignToken"/>
      <div class=" MatcToolbarItem MatcBoxShadow2" v-show="!hasDesignToken">
        <div type="button" data-dojo-attach-point="button" class="MatcToolbarColorButton">
            <span data-dojo-attach-point="icon" class="MatcToolbarColorIndicator">
            </span>
            <span v-if="label" class="MatcToolbarItemLabel">{{label}}</span>
        </div>
      </div>

        <div class="MatcToolbarPopUp MatcBoxShadowPopup MatcToolbarDropDownButtonPopup" role="menu" data-dojo-attach-point="popup" @click.stop="" @mousedown.stop="" >
          <ShadowSettings ref="settings" @changing="onTempChange" @resize="onResize"/>
           <div class="MatcToolbarPopupFooter" @click="onRemove">
            <span class="MatcToolbarPopupFooterNone mdi mdi-close-circle"></span>
            <span class="MatcToolbarPopupFooterLabel">No Shadow</span>
          </div>
        </div>

	</div>

</template>
<script>
import DojoWidget from 'dojo/DojoWidget'
import lang from 'dojo/_base/lang'
import _DropDown from './_DropDown'
import _Color from 'common/_Color'
import _DesignToken from './_DesignToken'
import DesignTokenView from './DesignTokenView'
import ShadowSettings from './ShadowSettings'

export default {
    name: 'BoxShadow',
    mixins:[_Color, DojoWidget, _DesignToken, _DropDown],
    data: function () {
        return {
            tab: 'position',
            defaultValue: {
              v: 0,
              h: 0,
              b: 0,
              s: 0,
              c: 'rgba(0,0,0,0.25)'
            },
            value: false,
            tempValue: false,
            label: '',
            reposition: true,
						arrowPosition: "right"
        }
    },
    components: {
      'DesignTokenView': DesignTokenView,
      'ShadowSettings': ShadowSettings
    },
    methods: {

      onVisible (){
        this.tempValue = false
        this.$refs.settings.setValue(this.value)
			},

      onResize () {
        this.updatePosition()
      },

      setHasInsertAndSpread (v) {
        if (this.$refs.settings) {
          this.$refs.settings.setHasInsertAndSpread(v)
        }
      },

      onHide () {
        if (this.tempValue && (this.tempValue.v !== 0 || this.tempValue.h !== 0 || this.tempValue.s !== 0 || this.tempValue.b !== 0)) {
          this.emit('change', this.tempValue)
        }
      },

      onTempChange (v) {
        this.tempValue = v
        this.emit('changing', this.tempValue)
      },

			onRemove (e){
        this.tempValue = false
				this.stopEvent(e);
				this.onChange(null);
			},

			setValue (v){

				if (v) {
					this.value = lang.clone(v);
          if (this.icon) {
            this.icon.style.background = v.c
          }
          if (!v.i) {
            this.label = 'Drop Shadow'
          } else {
            this.label = 'Inner Shadow'
          }

				} else {
          this.value = lang.clone(this.defaultValue)
           if (this.icon) {
            this.icon.style.background = ''
          }
          this.label = 'No Shadow'
        }

      }
    },
    mounted () {
      this.setCssProps(['boxShadow'])
    }
}
</script>